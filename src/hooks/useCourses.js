import { useEffect, useState } from "react";
import courseCatalog from "../data/courses.json";

const useCourses = () => {
  const [courses, setCourses] = useState(courseCatalog);

  useEffect(() => {
    let mounted = true;
    fetch("/api/courses")
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json();
      })
      .then((result) => {
        if (mounted && result?.courses) setCourses(result.courses);
      })
      .catch(() => {
        // Use the bundled course data if the API is temporarily unavailable.
      });

    return () => {
      mounted = false;
    };
  }, []);

  return courses;
};

export default useCourses;
