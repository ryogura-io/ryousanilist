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
  const [selectedFilters, setSelectedFilters] = useState([]); // ✅ merged genres + tags
  const [type, setType] = useState("All");

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
                tags { name }
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

    const variables = { username: "RyouGura" };

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

// ✅ Filtering (check both genres and tags)
const filtered = animeList.filter((anime) => {
  const matchesFilters =
    selectedFilters.length === 0 ||
    selectedFilters.every(
      (f) =>
        anime.genres.includes(f) ||
        anime.tags.some((t) => t.name.toLowerCase() === f.toLowerCase())
    );

  const matchesType = type === "All" || anime.format === type;
  return matchesFilters && matchesType;
});

// ✅ Collect unique genres + tags
const allGenres = [...new Set(animeList.flatMap((a) => a.genres))];
const allTags = [...new Set(animeList.flatMap((a) => a.tags.map((t) => t.name)))];

// ✅ Add only "isekai" tag manually
const allFilters = [...new Set([...allGenres, "isekai"])];
// if you want to allow ALL tags, replace the above with:
// const allFilters = [...new Set([...allGenres, ...allTags, "isekai"])];

// ✅ Toggle genre/tag
function toggleFilter(filter) {
  setSelectedFilters((prev) =>
    prev.includes(filter)
      ? prev.filter((f) => f !== filter)
      : [...prev, filter]
  );
}


  return (
    <>
      {/* Intro Section */}
      <section className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center bg-dark text-white">
        <DotPattern glow={true} className={cn("[mask-image:radial-gradient(2000px_circle_at_center,transparent,white)]")} />
        <h1 className="display-1 fw-bold mb-3"><AuroraText>Gura-io</AuroraText></h1>
        <p className="lead mb-4 container"><b>Welcome to My Anime List!</b><br />
          Here you'll find a collection of anime I've explored, sorted by genre, tag and type. Use the filters to discover shows that match your vibe — whether it’s action-packed adventures, heartfelt dramas, or even a classic isekai journey.</p>
        <a href="#list" className="btn btn-danger btn-lg rounded-0">Get Started</a>
      </section>

      {/* Anime Section */}
      <div className="container py-5 bg-dark text-white" id="list">
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
              {["All", ...new Set(animeList.map((a) => a.format))].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="col-md-9">
            <label className="form-label fw-semibold">Genres & Tags</label>
            <div className="d-flex flex-wrap gap-2">
              {allFilters.map((f) => {
                const isActive = selectedFilters.includes(f);
                return (
                  <button
                    key={f}
                    onClick={() => toggleFilter(f)}
                    className={`btn btn-sm ${
                      isActive ? "btn-primary" : "btn-outline-secondary"
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
              {selectedFilters.length > 0 && (
                <button
                  onClick={() => setSelectedFilters([])}
                  className="btn btn-sm btn-danger"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Counter */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="text-light font-heading">Anime List</h4>
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
                <div className="d-flex border rounded shadow-sm h-100 anime-list bg-secondary">
                  {/* Thumbnail */}
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

                  {/* Info */}
                  <div className="flex-grow-1 p-2 text-white">
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

