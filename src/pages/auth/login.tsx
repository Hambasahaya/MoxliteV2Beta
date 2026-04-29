import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { LoginForm } from "@/components/auth/LoginForm";

const LoginPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Login - Moxlite</title>
        <meta name="description" content="Login to your Moxlite account" />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <main>
        <LoginForm />
      </main>
    </>
  );
};

export default LoginPage;
