import { jwtDecode } from "jwt-decode";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { InvalidCredentials } from "@/lib/error";
import Axios from "@/lib/axios";

async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/authentication/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: token.refreshToken,
        }),
      }
    );

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message);
    }

    const result = await response.json();
    const decode = jwtDecode(result.result.accessToken);
    return {
      ...token,
      accessToken: result.result.accessToken,
      refreshToken: result.result.refreshToken,
      expiresAt: decode.exp!,
    };
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: "RefreshTokenError",
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      id: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
        token: { label: "token", type: "text" },
      },
      type: "credentials",
      async authorize(credentials) {
        let data;
        let status;

        if (credentials.token) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/authentication/token-login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization_token: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
              },
              body: JSON.stringify({
                token: credentials.token,
              }),
            }
          );
          data = await res.json();
          status = res.status;
        } else {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/authentication/password-login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization_token: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );
          data = await res.json();
          status = res.status;
        }

        if (data?.success === false) {
          throw new InvalidCredentials({
            message: data?.message || "Invalid credentials!",
            errorMessage: data?.errorMessage || [],
          });
        }
        if (status === 200) {
          return {
            ...data.result,
            id: data.result.userId,
          };
        }
      },
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      // @ts-ignore
      profile(profile) {
        return {
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  debug: false,
  secret: process.env.NEXT_AUTH_SECRET,
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
    newUser: "/onboard",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.type === "credentials") {
        return !!user;
      }

      const res = await Axios.post("/authentication/oauth-login", {
        email: user.email,
      });

      if (res.status === 200) {
        user.id = res.data.result.userId;
        user.name = res.data.result.name;
        user.email = res.data.result.email;
        user.image = res.data.result.image;
        user.role = res.data.result.role;
        user.refreshToken = res.data.result.refreshToken;
        user.accessToken = res.data.result.accessToken;
        return true;
      }
      return false;
    },

    // @ts-ignore
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        token.name = session.name;
        token.email = session.email;
        token.accessToken = session.accessToken;
        return token;
      }

      if (user) {
        token.id = user.id!;
        token.name = user.name!;
        token.email = user.email!;
        token.image = user.image!;
        token.role = user.role!;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        return token;
      }

      const decodedToken = jwtDecode(token.accessToken as string);
      const currentTime = Date.now() / 1000;

      // if not expired, return token
      if (decodedToken.exp! > currentTime) {
        return token;
      }

      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (token) {
        const { accessToken, refreshToken, email, id, role, name, image } =
          token;

        session.user.id = id as string;
        session.user.name = name as string;;
        session.user.email = email!;
        session.user.image = image as string;;
        session.user.role = role as "user" | "moderator" | "admin" | "former";
        session.user.accessToken = accessToken as string;
        session.user.refreshToken = refreshToken as string;
        session.error = token.error as "RefreshTokenError" | undefined;
      }

      return session;
    },
  },
});
