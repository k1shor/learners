import { useEffect, useState } from "react";
import courseCatalog from "../data/courses.json";

const useCourses = () => {
  const [courses, setCourses] = useState(courseCatalog);

  useEffect(() => {
    let mounted = true;
    fetch("/api/instructors")
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json();
      })
      .then((result) => {
        if (!mounted || !result?.instructors) return;
        const instructorNames = new Map(
          result.instructors.map(({ sourceName, name }) => [sourceName, name]),
        );
        setCourses(
          courseCatalog.map((course) => ({
            ...course,
            instructor:
              instructorNames.get(course.instructor) ?? course.instructor,
          })),
        );
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
