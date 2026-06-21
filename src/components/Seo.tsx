"use client";
import { useEffect } from "react";

type Props = {
  title: string;
  description: string;
  canonical?: string;
  noindex?: boolean;
  schema?: Record<string, unknown> | Record<string, unknown>[];
};

const setMetaTag = (attr: "name" | "property", key: string, content: string) => {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

export const Seo = ({ title, description, canonical, noindex, schema }: Props) => {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      setMetaTag("name", "description", description);
      setMetaTag("property", "og:description", description);
      setMetaTag("name", "twitter:description", description);
    }
    if (title) {
      setMetaTag("property", "og:title", title);
      setMetaTag("name", "twitter:title", title);
    }
    setMetaTag("name", "robots", noindex ? "noindex, follow" : "index, follow");

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }

    let scriptEl: HTMLScriptElement | null = null;
    if (schema) {
      scriptEl = document.createElement("script");
      scriptEl.type = "application/ld+json";
      scriptEl.text = JSON.stringify(schema);
      document.head.appendChild(scriptEl);
    }

    return () => {
      if (scriptEl) document.head.removeChild(scriptEl);
    };
  }, [title, description, canonical, noindex, schema]);

  return null;
};