import "@/styles/bootstrap.min.css"; // local bootstrap
import "@/styles/globals.css";

export const metadata = {
  title: "Ryou's AniList",
  description: "Static AniList Viewer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Load Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Audiowide&family=Playwrite+Belgie+Walloon&family=Calistoga&family=IBM+Plex+Mono&family=Sofia&family=Trirong&family=IBM+Plex+Sans&family=Signika+Negative&family=Playwrite+Argentina&family=Dancing+Script&family=Bebas+Neue&family=Josefin+Sans&family=Ubuntu&family=Rubik&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-dark">{children}</body>
    </html>
  );
}
