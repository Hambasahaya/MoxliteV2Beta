import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { SignupForm } from "@/components/auth/SignupForm";

const SignupPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sign Up - Moxlite</title>
        <meta name="description" content="Create a new Moxlite account" />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <main>
        <SignupForm />
      </main>
    </>
  );
};

export default SignupPage;
