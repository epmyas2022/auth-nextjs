import SignInForm from "@/auth/next/components/SignInForm";

export default async function SignIn({
  searchParams
}: {
  searchParams: { oauthError?: string };
}) {

  const { oauthError } = await searchParams;
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="border bg-slate-50 p-6 rounded-sm border-slate-200 shadow-md w-full max-w-md">
        <div className="flex gap-2 items-center justify-center">
          <span className="mdi mdi-security text-6xl text-slate-600"></span>

          <h1 className="font-bold text-3xl mb-2">
            Iniciar sesión
          </h1>
        </div>
        <p className="text-gray-600 mx-auto text-center my-2 max-w-xs text-lg">
          Por favor, ingresa tus credenciales para iniciar sesión.
        </p>

        {oauthError && (
          <div className="bg-red-100 text-red-400 p-4 rounded-md mb-4">
            <p className="font-semibold">Error de autenticación:</p>
            <p>{oauthError}</p>
          </div>
        )}

        <SignInForm />
      </div>
    </div>
  );
}
