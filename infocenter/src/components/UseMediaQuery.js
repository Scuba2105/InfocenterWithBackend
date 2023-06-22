import useMediaQueries from "media-queries-in-react" 

export const mediaQueries = useMediaQueries({
  laptop: "(max-width: 1250px)",
  desktop: "(min-width: 1800px)"
});