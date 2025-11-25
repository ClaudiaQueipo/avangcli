"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import React from "react"

import ClippedShape from "@/components/magicui/cliped-shape"
import { type GitHubUser, useGitHubUsers } from "@/hooks/use-github-api"

const CREATORS_USERNAMES = ["ClaudiaQueipo", "solyfaby", "ppit890819", "IronBeardX", "luislicea1"]

const CreatorCard = ({ creator }: { creator: GitHubUser }) => (
  <Link
    href={creator.html_url}
    target="_blank"
    rel="noopener noreferrer"
    className="transform hover:-translate-y-1 transition-all duration-300"
  >
    <ClippedShape
      width={220}
      height={250}
      color="#252525"
      className="hover:border-lime-400/50 transition-colors duration-300"
      bubbleContent={<img src={creator.avatar_url} alt={creator.login} className="w-full h-full object-cover" />}
    >
      <div className="text-center px-6">
        <p className="text-white font-semibold text-xl leading-tight mb-2">{creator.name || creator.login}</p>
        <p className="text-lime-400 text-sm font-medium">@{creator.login}</p>
      </div>
    </ClippedShape>
  </Link>
)

const CreatorsSection = () => {
  const t = useTranslations("home.creators")
  const { data: creatorsData, loading } = useGitHubUsers(CREATORS_USERNAMES)

  return (
    <section id="creators" className="w-full py-20 px-6 bg-[#161616]">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          {t("title")}{" "}
          <span className="text-[#BBF451] italic font-serif drop-shadow-[0_0_25px_rgba(132,204,22,0.4)]">
            {t("titleHighlight")}
          </span>
        </h2>
        <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">{t("description")}</p>

        <div className="flex flex-wrap justify-center gap-8">
          {loading || !creatorsData
            ? CREATORS_USERNAMES.map((username) => (
                <div key={username} className="animate-pulse">
                  <ClippedShape
                    width={200}
                    height={200}
                    color="#1a1a1a"
                    bubbleContent={<div className="w-full h-full bg-gray-700"></div>}
                  >
                    <div className="text-center px-6 space-y-3">
                      <div className="h-6 bg-gray-600 rounded w-3/4 mx-auto"></div>
                      <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
                    </div>
                  </ClippedShape>
                </div>
              ))
            : creatorsData.map((creator) => <CreatorCard key={creator.login} creator={creator} />)}
        </div>
      </div>
    </section>
  )
}

export default CreatorsSection
