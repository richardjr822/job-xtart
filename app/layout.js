import "./globals.css";

export const metadata = {
  title: "Job Start", 
  description: "Find flexible work in your community.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children} 
      </body>
    </html>
  );
}