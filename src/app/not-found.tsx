export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 text-center bg-indigo-950">
      <h1 className="text-4xl font-bold text-white">404 - Page Not Found</h1>
      <p className="text-muted-foreground">Sorry, the page you are looking for does not exist.</p>
    </div>
  );
}
