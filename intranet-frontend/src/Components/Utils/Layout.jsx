import NavBar from "@/Components/Utils/NavBar";

export default function AuthenticatedLayout({ children }) {
  return (
    <>
      <div className="min-h-screen">
        <NavBar />
        {/* Contenu principal */}
        <main className="flex-1 container mx-auto py-6">{children}</main>
      </div>
    </>
  );
}
