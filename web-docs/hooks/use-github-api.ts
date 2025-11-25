"use client"

import { useCallback, useEffect, useState } from "react"

export interface GitHubUser {
  login: string
  name: string | null
  avatar_url: string
  html_url: string
  bio?: string | null
  company?: string | null
  location?: string | null
  followers?: number
  following?: number
  public_repos?: number
}

export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  stargazers_count: number
  watchers_count: number
  forks_count: number
  open_issues_count: number
  language: string | null
  created_at: string
  updated_at: string
}

type RequestState<T> = {
  data: T | null
  loading: boolean
  error: Error | null
}

interface FetchOptions {
  cache?: RequestCache
  revalidate?: number
  headers?: HeadersInit
}

const DEFAULT_HEADERS = {
  "User-Agent": "Avangcli Landing Page",
  Accept: "application/vnd.github.v3+json"
}

export function useGitHubApi<T = unknown>(
  url: string | null,
  options: FetchOptions = {}
): RequestState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<RequestState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const fetchData = useCallback(async () => {
    if (!url) {
      setState({ data: null, loading: false, error: null })
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch(url, {
        headers: {
          ...DEFAULT_HEADERS,
          ...options.headers
        },
        cache: options.cache,
        next: options.revalidate ? { revalidate: options.revalidate } : undefined
      })

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setState({ data, loading: false, error: null })
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Unknown error occurred")
      console.error("[useGitHubApi] Error fetching data:", err)
      setState({ data: null, loading: false, error: err })
    }
  }, [url, options.cache, options.revalidate, options.headers])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    ...state,
    refetch: fetchData
  }
}

export function useGitHubRepository(owner: string, repo: string, options: FetchOptions = {}) {
  const url = `https://api.github.com/repos/${owner}/${repo}`
  return useGitHubApi<GitHubRepository>(url, options)
}

export function useGitHubUser(username: string | null, options: FetchOptions = {}) {
  const url = username ? `https://api.github.com/users/${username}` : null
  return useGitHubApi<GitHubUser>(url, options)
}

export function useGitHubUsers(usernames: string[], options: FetchOptions = {}) {
  const [state, setState] = useState<RequestState<GitHubUser[]>>({
    data: null,
    loading: false,
    error: null
  })

  const fetchUsers = useCallback(async () => {
    if (!usernames || usernames.length === 0) {
      setState({ data: [], loading: false, error: null })
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const promises = usernames.map(async (username) => {
        const response = await fetch(`https://api.github.com/users/${username}`, {
          headers: {
            ...DEFAULT_HEADERS,
            ...options.headers
          },
          cache: options.cache,
          next: options.revalidate ? { revalidate: options.revalidate } : undefined
        })

        if (!response.ok) {
          console.warn(`[useGitHubUsers] Could not fetch user: ${username}`)
          return null
        }

        return response.json() as Promise<GitHubUser>
      })

      const results = await Promise.all(promises)
      const validUsers = results.filter((user): user is GitHubUser => user !== null)

      setState({ data: validUsers, loading: false, error: null })
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Unknown error occurred")
      console.error("[useGitHubUsers] Error fetching users:", err)
      setState({ data: null, loading: false, error: err })
    }
  }, [usernames, options.cache, options.revalidate, options.headers])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return {
    ...state,
    refetch: fetchUsers
  }
}

export function useGitHubStars(owner: string, repo: string, options: FetchOptions = {}) {
  const { data, loading, error, refetch } = useGitHubRepository(owner, repo, options)

  return {
    starCount: data?.stargazers_count ?? null,
    loading,
    error,
    refetch
  }
}
