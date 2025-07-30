import SignUpForm from "@/auth/next/components/SignUpForm";

export default function SignUp() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="border bg-slate-50 p-6 rounded-sm border-slate-200 shadow-md w-full max-w-md">
        <h1 className="font-bold text-3xl mb-2">Regístrate</h1>
        <p className="text-gray-600  my-2  text-md">
          Por favor, completa el siguiente formulario para crear una cuenta.
        </p>

        <SignUpForm></SignUpForm>
      </div>
    </div>
  );
}
