import { createContext, useContext } from "react";

// True inside <ScreenPreview>: the landing page shows live copies of app
// screens, and their titles must not join the landing page's heading outline.
export const PreviewContext = createContext(false);

export const useHeading = (tag) => (useContext(PreviewContext) ? "p" : tag);
