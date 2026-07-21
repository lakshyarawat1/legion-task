import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { api } from "@/state/api";
import { useAuth } from "@clerk/nextjs";

export const useNotificationStream = () => {
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useDispatch();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [lastNotification, setLastNotification] = useState<any>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    let eventSource: EventSource | null = null;

    const connectStream = async () => {
      try {
        // We use Clerk getToken to append as a query param for auth
        const token = await getToken();
        if (!token) return;

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
        // Important: we append the token as a query parameter because EventSource doesn't support headers
        const url = new URL(`${baseUrl}/notifications/stream`);
        url.searchParams.append("__clerk_db_jwt", token);

        eventSource = new EventSource(url.toString());

        eventSource.onopen = () => {
          setIsConnected(true);
          console.log("[SSE] Connected to notification stream");
        };

        eventSource.onmessage = (event) => {
          // Handled generically or fallback
        };

        eventSource.addEventListener("heartbeat", (event) => {
          // Keep-alive, nothing to do
        });

        eventSource.addEventListener("notification", (event: MessageEvent) => {
          try {
            const data = JSON.parse(event.data);
            
            // Invalidate the Notifications tag to trigger a re-fetch
            dispatch(api.util.invalidateTags([{ type: "Notifications", id: "LIST" }, { type: "Notifications", id: "UNREAD_COUNT" }]));
            
            // Store it to trigger a toast
            setLastNotification(data);
          } catch (error) {
            console.error("Error parsing notification event", error);
          }
        });

        eventSource.onerror = (error) => {
          console.error("[SSE] Stream error, attempting reconnect...", error);
          setIsConnected(false);
          eventSource?.close();
          // EventSource auto-reconnects, but if we manually close we might need to recreate it.
          // The browser's native EventSource will try to reconnect automatically on most errors.
        };
      } catch (error) {
        console.error("Failed to setup SSE:", error);
      }
    };

    connectStream();

    return () => {
      if (eventSource) {
        eventSource.close();
        setIsConnected(false);
      }
    };
  }, [isLoaded, isSignedIn, getToken, dispatch]);

  return { isConnected, lastNotification };
};
