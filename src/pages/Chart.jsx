// import { Timestamp, collection, getDocs, query, where } from 'firebase/firestore';
// import Highcharts from 'highcharts'
// import HighchartsReact from "highcharts-react-official";
// import { blogDb } from '../config/firebase';
// import { useEffect, useState } from 'react';




// const createDateMap = (blogs) => {
//   const blogDate = {}

//   blogs.forEach(post => {
//     const createDate = post.createdAt.toDate()
//     const createDateKey = createDate.toISOString().split('T')[0]

//     if (!blogDate[createDateKey]) {
//       blogDate[createDateKey] = { createdPost: 0, publisedPost: 0 }
//     }

//     blogDate[createDateKey] += 1

//     if (post.publishedDate) {
//       const publishDate = post.publishedDate.toDate()
//       const publishedDateKey = publishDate.toISOString().split('T')[0]

//       if (!blogDate[publishedDateKey]) {
//         blogDate[publishedDateKey] = { createdPost: 0, publishedPost: 0 }
//       }
//       blogDate[publishedDateKey] += 1

//     }
//   })
//   return blogDate
// }


// const fillMissingDays = (blogDate, startDate, endDate) => {
//   const filledMap = { ...blogDate }

//   console.log(filledMap)

//   const currentDate = new Date(startDate)

//   while (currentDate <= endDate) {
//     const key = currentDate.toISOString().split('T')[0]

//     if (!filledMap[key]) {
//       filledMap[key] = { createdPost: 0, publisedPost: 0 }
//     }

//     currentDate.setDate(currentDate.getDate() + 1)
//   }

//   return filledMap
// }

// const extractChartData = (filledMap) => {
//   const arrangedDates = Object.keys(filledMap).sort()

//   // console.log(arrangedDates)

//   return {
//     categories: arrangedDates,
//     createdCountPost: arrangedDates.map(date => filledMap[date].createdPost),
//     publishedCountPost: arrangedDates.map(date => filledMap[date].publishedPost)
//   }

// }


// const Chart = () => {
//   const [chartData, setChartData] = useState()


//   useEffect(() => {
//     const createChart = async () => {
//       try {
//         const now = new Date()
//         const startDate = new Date()
//         startDate.setDate(now.getDate() - 7)
//         startDate.setHours(0, 0, 0, 0)

//         const endDate = new Date()
//         endDate.setHours(23, 59, 59, 999)

//         const blogPostRef = collection(blogDb, 'blog_posts')

//         const dateOfPosts = query(
//           blogPostRef,
//           where('createdAt', '>=', Timestamp.fromDate(startDate)),
//           where('createdAt', '<=', Timestamp.fromDate(endDate))
//         )

//         const snapshot = await getDocs(dateOfPosts)

//         const blogPosts = snapshot.docs.map(doc => ({
//           ...doc.data(),
//           id: doc.id
//         }))

//         const dateMap = createDateMap(blogPosts)

//         const filledMap = fillMissingDays(dateMap, startDate, endDate)

//         const { categories, createdCountPost, publishedBlogPost } = extractChartData(filledMap)

//         setChartData({ categories, createdCountPost, publishedBlogPost })
//       } catch (error) {
//         console.error(error)
//       }
//     }

//     createChart()
//   }, [])

//   const options = chartData ? {
//     chart: {
//       type: 'column'
//     },
//     title: {
//       text: 'Post created vs post published (last 7 days)'
//     },
//     xAxis: {categories: chartData.categories},
//     yAxis: {title: {text: 'Number of post'} },
//     series: [
//       {
//         name: 'Post created',
//         data: chartData.createdCountPost
//       },
//       {
//         name: 'Published Post',
//         data: chartData.publishedBlogPost
//       }
//     ]
//   } : {}

//   return (
//     <HighchartsReact
//       highcharts={Highcharts}
//       options={options}
//     />
//   )
// }


// export default Chart



import { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { blogDb } from "../config/firebase";

// --- helper functions outside the component ---

const buildDateMap = (posts) => {
  const dateMap = {};

  posts.forEach(post => {
    const createdDate = post.createdAt.toDate();
    const createdKey = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, "0")}-${String(createdDate.getDate()).padStart(2, "0")}`

    if (!dateMap[createdKey]) {
      dateMap[createdKey] = { created: 0, published: 0 };
    }
    dateMap[createdKey].created += 1;

    if (post.publishedDate) {
      const publishedDate = post.publishedDate.toDate();
      const publishedKey = `${publishedDate.getFullYear()}-${String(publishedDate.getMonth() + 1).padStart(2, "0")}-${String(publishedDate.getDate()).padStart(2, "0")}`

      if (!dateMap[publishedKey]) {
        dateMap[publishedKey] = { created: 0, published: 0 };
      }
      dateMap[publishedKey].published += 1;
    }
  });

  return dateMap;
};

const fillMissingDays = (dateMap, startDate, endDate) => {
  const filledMap = { ...dateMap };
  const current = new Date(startDate);

  while (current <= endDate) {
    const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`
    if (!filledMap[key]) {
      filledMap[key] = { created: 0, published: 0 };
    }
    current.setDate(current.getDate() + 1);
  }

  return filledMap;
};

const extractChartData = (filledMap) => {
  const sortedDates = Object.keys(filledMap).sort();

  return {
    categories: sortedDates,
    createdCounts: sortedDates.map(date => filledMap[date].created),
    publishedCounts: sortedDates.map(date => filledMap[date].published),
  };
};

// --- the component ---

const PostsChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndProcess = async () => {
      try {
        // step 1: date range
        const now = new Date();
        const startDate = new Date();
        startDate.setDate(now.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);

        // step 2: fetch from firestore
        const postsRef = collection(blogDb, "blog_posts");
        const q = query(
          postsRef,
          where("createdAt", ">=", Timestamp.fromDate(startDate)),
          where("createdAt", "<=", Timestamp.fromDate(endDate))
        );
        const snapshot = await getDocs(q);
        const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // step 3: build date map
        const dateMap = buildDateMap(posts);

        // step 4: fill missing days
        const filledMap = fillMissingDays(dateMap, startDate, endDate);

        // step 5: extract arrays
        const { categories, createdCounts, publishedCounts } = extractChartData(filledMap);

        // step 6: set state
        setChartData({ categories, createdCounts, publishedCounts });
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcess();
  }, []);

  const options = chartData ? {
    chart: {
      type: 'column'
    },
    title: { text: "Posts Created vs Published (Last 7 Days)" },
    xAxis: { categories: chartData.categories },
    yAxis: { title: { text: "Number of Posts" } },
    series: [
      { name: "Created", data: chartData.createdCounts },
      { name: "Published", data: chartData.publishedCounts },
    ],
  } : {};

  if (loading) return <p>Loading chart...</p>;

  return (
    <HighchartsReact highcharts={Highcharts} options={options} />
  );
};

export default PostsChart;