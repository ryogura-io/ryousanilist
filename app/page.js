"use client";
import React, { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { GradientText } from "@/components/animate-ui/text/gradient";
import { AuroraText } from "@/components/magicui/aurora-text";
import { useEffect } from "react";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";

export default function Home() {
  const [animeList, setAnimeList] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [type, setType] = useState("All");
  const [name, setName] = useState("");

  function handleChange(event) {
    setName(event.target.value);
  }
  useEffect(() => {
    async function fetchData() {
      const query = `
        query ($username: String) {
          MediaListCollection(userName: $username, type: ANIME) {
            lists {
              entries {
                media {
                  id
                  title { romaji english }
                  coverImage { large }
                  genres
                  averageScore
                  episodes
                  status
                  format
                  siteUrl
                }
              }
            }
          }
        }
      `;

      const variables = { username: "RyouGura" }; // <-- your AniList username

      const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });

      const data = await res.json();
      const entries = data.data.MediaListCollection.lists.flatMap(
        (l) => l.entries
      );
      setAnimeList(entries.map((e) => e.media));
    }

    fetchData();
  }, []);

  // Filtering (AND mode for genres)
  const filtered = animeList.filter((anime) => {
    const matchesGenres =
      selectedGenres.length === 0 ||
      selectedGenres.every((g) => anime.genres.includes(g));
    const matchesType = type === "All" || anime.format === type;
    return matchesGenres && matchesType;
  });

  // Collect unique genres + types
  const allGenres = [...new Set(animeList.flatMap((a) => a.genres))];
  const allTypes = ["All", ...new Set(animeList.map((a) => a.format))];

  // Toggle genre
  function toggleGenre(genre) {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  }

  return (
    <>
      <section className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center bg-dark text-white">
        <DotPattern glow={true} className={cn("[mask-image:radial-gradient(2000px_circle_at_center,transparent,white)]")}
        />
        <h1 className="display-1 fw-bold mb-3"><AuroraText>Gura-io</AuroraText></h1>
        <p className="lead mb-4">Multi session WhatsApp bot built for Enterprise-grade performance.</p>
        <a href="#username" className="btn btn-danger btn-lg rounded-0">Get Started</a>
      </section>

      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-dark text-white">
        <main className="form-signin w-100 text-center">


          <h1 className="mb-3" id="username">
            <AuroraText>Hello {name} <i className="bi bi-lightbulb"></i></AuroraText>
          </h1>

          <div className="form-floating mb-3 text-danger">
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              placeholder="Username"
              autoComplete="off"
              onChange={handleChange}
              value={name}
            />
            <label htmlFor="floatingInput">Username</label>
          </div>

          <button className="btn btn-outline-danger w-100 py-2" type="button">
            Youkoso
          </button>

          {/* <img src="/images/back1.jpg" className="img-fluid my-3" alt="Background" /> */}

        </main>
      </div>
      <div className="container py-5 bg-dark text-white">
        <h1 className="display-5 fw-bold mb-4 title">Ryou's AnimeList</h1>

        {/* Filters */}
        <div className="row mb-5">
          <div className="col-md-3 mb-3">
            <label className="form-label fw-semibold">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="form-select"
            >
              {allTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="col-md-9">
            <label className="form-label fw-semibold">Genres Filter</label>
            <div className="d-flex flex-wrap gap-2">
              {allGenres.map((g) => {
                const isActive = selectedGenres.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => toggleGenre(g)}
                    className={`btn btn-sm ${isActive ? "btn-primary" : "btn-outline-secondary"
                      }`}
                  >
                    {g}
                  </button>
                );
              })}
              {selectedGenres.length > 0 && (
                <button
                  onClick={() => setSelectedGenres([])}
                  className="btn btn-sm btn-danger"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="text-light font-heading">
            Anime List
          </h4>
          <span className="badge bg-primary">
            Showing {filtered.length} anime
          </span>
        </div>


        {/* Anime Grid */}
        <div className="row g-3">
          {filtered.map((anime) => (
            <div key={anime.id} className="col-12 col-lg-6">
              <a
                href={anime.siteUrl}
                target="_blank"
                rel="noreferrer"
                className="text-decoration-none text-dark"
              >
                <div className="d-flex border rounded shadow-sm h-100 anime-list">
                  {/* Left: Thumbnail */}
                  <img
                    src={anime.coverImage.large}
                    alt={anime.title.romaji}
                    className="img-fluid rounded-0"
                    style={{
                      width: "100px",
                      height: "100%",
                      objectFit: "cover",
                      borderTopLeftRadius: "0.25rem",
                      borderBottomLeftRadius: "0.25rem",
                    }}
                  />

                  {/* Right: Text Info */}
                  <div className="flex-grow-1 p-2">
                    <h6 className="mb-1 font-heading">
                      {anime.title.english || anime.title.romaji}
                    </h6>
                    <p className="mb-1 font-score">⭐ {anime.averageScore ?? "N/A"}</p>
                    <p className="mb-1 font-meta">{anime.episodes ?? "?"} eps</p>
                    <div>
                      <span className="badge me-1 bg-warning font-badge">
                        {anime.format}
                      </span>
                      <span className="badge bg-primary font-badge">
                        {anime.status}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>



        {/* No results */}
        {filtered.length === 0 && (
          <p className="text-muted mt-5">No anime match your filters.</p>
        )}
      </div>
    </>
  );
}
