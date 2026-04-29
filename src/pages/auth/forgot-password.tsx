import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

const ForgotPasswordPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Forgot Password - Moxlite</title>
        <meta name="description" content="Reset your Moxlite account password" />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <main>
        <ForgotPasswordForm />
      </main>
    </>
  );
};

export default ForgotPasswordPage;
