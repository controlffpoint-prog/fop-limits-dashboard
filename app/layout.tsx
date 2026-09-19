import "./globals.css";

export const metadata = {
  title: "FOP Limits Dashboard",
  description: "Мониторинг лимитов ФОП в реальном времени",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
