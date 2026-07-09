"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { BellOff, BellRing, Check, Loader2 } from "lucide-react";
import { cn } from "@/shared/utils";

type NotificationStatus = "default" | "granted" | "denied" | "unsupported";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function getInitialStatus(): NotificationStatus {
  if (typeof window === "undefined") return "default";
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return "unsupported";
  if ("Notification" in window) {
    const perm = Notification.permission;
    if (perm === "denied") return "denied";
    return perm as NotificationStatus;
  }
  return "default";
}

export default function PushNotificationManager() {
  const [status, setStatus] = useState<NotificationStatus>(getInitialStatus);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const supported = status !== "unsupported";

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setIsSubscribed(!!sub))
      .catch(() => setIsSubscribed(false));
  }, []);

  const subscribe = useCallback(async () => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      setStatus(permission as NotificationStatus);
      if (permission !== "granted") {
        setLoading(false);
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const existingSub = await reg.pushManager.getSubscription();
      if (existingSub) {
        setIsSubscribed(true);
        setLoading(false);
        return;
      }

      const vapidKey = process.env.NEXT_PUBLIC_VAPID_KEY;
      if (!vapidKey) {
        setLoading(false);
        return;
      }

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
      });

      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api/v1"}/push/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });

      setIsSubscribed(true);
    } catch (err) {
      console.error("Push subscription failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.getSubscription();
      if (subscription) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api/v1"}/push/unsubscribe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        await subscription.unsubscribe();
      }
      setIsSubscribed(false);
    } catch (err) {
      console.error("Push unsubscribe failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  if (!supported) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border-2 border-border bg-surface-1 p-6"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
          isSubscribed
            ? "bg-gradient-to-br from-emerald-500/30 to-emerald-500/10 border border-emerald-400/40 text-emerald-400"
            : "bg-gradient-to-br from-amber-500/30 to-amber-500/10 border border-amber-400/40 text-amber-400"
        )}>
          {isSubscribed ? <BellRing size={22} /> : <BellOff size={22} />}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-ink-1 uppercase tracking-wider">Notifications Push</h3>
          <p className="text-xs text-ink-3 mt-0.5">
            {status === "denied"
              ? "Notifications bloquées par le navigateur"
              : isSubscribed
                ? "Vous recevez les notifications"
                : "Activez pour ne rien manquer"}
          </p>
        </div>
        <div className={cn(
          "w-3 h-3 rounded-full",
          isSubscribed ? "bg-emerald-400 animate-pulse" : "bg-ink-3/30"
        )} />
      </div>

      {status === "denied" ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-400/30 text-red-400 text-xs font-semibold">
          <BellOff size={14} />
          Les notifications sont bloquées. Veuillez les activer dans les paramètres du navigateur.
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          disabled={loading}
          onClick={isSubscribed ? unsubscribe : subscribe}
          className={cn(
            "w-full h-12 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all",
            isSubscribed
              ? "border-2 border-red-400/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-400/50"
              : "bg-gradient-to-r from-gold to-gold/90 text-ink-1 shadow-lg shadow-gold/30 hover:shadow-xl hover:shadow-gold/40"
          )}
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : isSubscribed ? (
            <>
              <BellOff size={16} strokeWidth={2.5} />
              Se désabonner
            </>
          ) : (
            <>
              <Check size={16} strokeWidth={2.5} />
              S&apos;abonner aux notifications
            </>
          )}
        </motion.button>
      )}
    </motion.div>
  );
}
