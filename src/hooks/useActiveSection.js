import { useState, useEffect } from "react";

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    // intersection observer logic will go here
  }, []);

  return activeSection;
}
