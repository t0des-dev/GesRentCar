"use client";

import type { ContentBlock } from "@/types/page";
import { motion } from "framer-motion";
import Image from "next/image";

function TextBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-${data.alignment || "left"}`}
        >
          {data.title && (
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter text-ink-1 mb-6">
              {data.title}
            </h2>
          )}
          {data.body && (
            <div
              className="text-lg text-ink-2 leading-relaxed space-y-4 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: data.body }}
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}

function ImageBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <motion.figure
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative aspect-video rounded-3xl overflow-hidden"
        >
          {data.image_url && (
            <img
              src={data.image_url}
              alt={data.alt || ""}
              className="w-full h-full object-cover"
            />
          )}
        </motion.figure>
        {data.caption && (
          <p className="text-center text-sm text-ink-3 mt-4">{data.caption}</p>
        )}
      </div>
    </section>
  );
}

function GalleryBlock({ data }: { data: Record<string, any> }) {
  const images: string[] = data.images || [];
  if (!images.length) return null;
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((url, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative aspect-square rounded-2xl overflow-hidden"
            >
              <img
                src={url}
                alt=""
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CardsBlock({ data }: { data: Record<string, any> }) {
  const items: { title?: string; desc?: string; image?: string }[] = data.items || [];
  if (!items.length) return null;
  return (
    <section className="py-16 md:py-24 bg-surface-1">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface-0 rounded-3xl border border-border overflow-hidden hover:shadow-lg transition-all"
            >
              {item.image && (
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={item.image} alt={item.title || ""} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
                {item.title && (
                  <h3 className="text-xl font-semibold text-ink-1 mb-2">{item.title}</h3>
                )}
                {item.desc && (
                  <p className="text-ink-2 leading-relaxed">{item.desc}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-4xl p-12 md:p-20 text-center"
          style={{ background: data.background_color || "hsl(var(--primary))" }}
        >
          {data.title && (
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter text-white mb-6">
              {data.title}
            </h2>
          )}
          {data.subtitle && (
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">{data.subtitle}</p>
          )}
          {data.button_text && (
            <a
              href={data.button_link || "#"}
              className="inline-flex items-center gap-2 bg-white text-ink-1 px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-all"
            >
              {data.button_text}
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function FaqBlock({ data }: { data: Record<string, any> }) {
  const items: { q?: string; a?: string }[] = data.items || [];
  if (!items.length) return null;
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="space-y-4">
          {items.map((item, i) => (
            <details
              key={i}
              className="group bg-surface-0 rounded-2xl border border-border overflow-hidden"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-ink-1 hover:text-primary transition-colors">
                {item.q}
                <span className="text-ink-3 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-ink-2 leading-relaxed">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function DividerBlock() {
  return (
    <div className="container mx-auto px-6">
      <hr className="border-border" />
    </div>
  );
}

export default function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "text":
      return <TextBlock data={block.data} />;
    case "image":
      return <ImageBlock data={block.data} />;
    case "gallery":
      return <GalleryBlock data={block.data} />;
    case "cards":
      return <CardsBlock data={block.data} />;
    case "cta":
      return <CtaBlock data={block.data} />;
    case "faq":
      return <FaqBlock data={block.data} />;
    case "divider":
      return <DividerBlock />;
    default:
      return null;
  }
}
