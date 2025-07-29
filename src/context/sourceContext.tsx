import React, { createContext, useContext, useEffect, useState } from "react";
import { getSources } from "../api/source.api";

interface SourceContextType {
  sources: string[];
  siteNameCounts: Record<string, number>;
  setSiteNameCounts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  setSources: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSource: string | null;
  setSelectedSource: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error?: string;
  setError?: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const SourceContext = createContext<SourceContextType | undefined>(undefined);

export const SourceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sources, setSources] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [siteNameCounts, setSiteNameCounts] = useState<Record<string, number>>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchSources = async () => {
      setLoading(true);
      try {
        const response = await getSources();
        setSources(response.siteNames);
        setSiteNameCounts(response.siteNameCounts || {});
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchSources();
  }, []);

  return (
    <SourceContext.Provider
      value={{
        sources,
        setSources,
        selectedSource,
        setSelectedSource,
        siteNameCounts,
        setSiteNameCounts,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </SourceContext.Provider>
  );
};

export const useSourceContext = (): SourceContextType => {
  const context = useContext(SourceContext);
  if (!context) {
    throw new Error("useSourceContext must be used within a SourceProvider");
  }
  return context;
};
