const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const axios = require('axios');
const app = express();
const NodeGeocoder = require('node-geocoder');
// const geocoder = require('geocoding-lite');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "trail",
    password: "abcd1234",
    port: 5432,
});

// const geocoder = NodeGeocoder({
//   provider: 'google', 
//   apiKey: 'AIzaSyBw4ReB0H_iu02nwIymnQv9KBkVVAVMQdw', 
// });


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});


const GOOGLE_MAPS_API_KEY = 'AIzaSyBw4ReB0H_iu02nwIymnQv9KBkVVAVMQdw';

// async function getCoordinates(location) {
//   try {
//     const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
//       params: {
//         address: location,
//         key: GOOGLE_MAPS_API_KEY,
//       }
//     });

//     console.log('Geocoding API Response:', response.data); // Log the response data


//     const { lat, lng } = response.data.results[0].geometry.location;
//     return { latitude: lat, longitude: lng };
//   } catch (error) {
//     console.error('Error fetching coordinates:', error);
//     throw error;
//   }
// }

// async function getCoordinates(location) {
//   try {
//     // Geocode the location
//     const result = await geocoder.geocode(location);
//     if (result.length > 0) {
//       return { latitude: result[0].latitude, longitude: result[0].longitude };
//     } else {
//       throw new Error('No coordinates found for the provided location');
//     }
//   } catch (error) {
//     console.error('Error fetching coordinates:', error.message);
//     throw error;
//   }
// }

// async function getCoordinates(location) {
//   try {
//     // Geocode the location
//     const response = await geocoder.geocode(location);
    
//     // Extract latitude and longitude from the response
//     if (response && response.length > 0) {
//       console.log("latitude are ",response[0].latitude,' longitudes are ',response[0].longitude);
//       return { latitude: response[0].latitude, longitude: response[0].longitude };
//     } else {
//       throw new Error('No coordinates found for the provided location');
//     }
//   } catch (error) {
//     console.error('Error fetching coordinates:', error.message);
//     throw error;
//   }
// }


// async function getCoordinates(address) {
//   const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyBw4ReB0H_iu02nwIymnQv9KBkVVAVMQdw`);
//   const data = await response.json();
//   if (data.results.length === 0) {
//     throw new Error('No results found');
//   }
//   const { lat, lng } = data.results[0].geometry.location;
  
//   return { latitude: lat, longitude: lng };
// }


// app.get('/find-jobs', (req, res) => {
//   res.render('find-jobs');
// });

// app.post('/find-jobs', async (req, res) => {
//   const { student_location, radius } = req.body;

//   try {
//     // Get coordinates for the student's location
//     const studentCoords = await getCoordinates(student_location);
//     const { latitude, longitude } = studentCoords;
//     console.log("latitudes ",latitude,"longitudes ",longitude);

//     // Fetch job locations from the database
//     const jobsResult = await pool.query('SELECT * FROM jobs');

//     // Fetch coordinates for each job location in parallel
//     const jobsWithCoordinates = await Promise.all(jobsResult.rows.map(async (job) => {
//       const jobCoords = await getCoordinates(job.location);
//       return {
    //     ...job,
    //     latitude: jobCoords.latitude,
    //     longitude: jobCoords.longitude,
    //   };
    // }));

    // // Filter jobs based on the specified radius
    // const nearbyJobs = jobsWithCoordinates.filter(job => {
    //   const distance = 6371 * Math.acos(
    //     Math.cos(degToRad(latitude)) * Math.cos(degToRad(job.latitude)) *
    //     Math.cos(degToRad(job.longitude) - degToRad(longitude)) +
    //     Math.sin(degToRad(latitude)) * Math.sin(degToRad(job.latitude))
    //   );
    //   return distance < radius;
    // });

//     res.render('jobs-nearby', { jobs: nearbyJobs });
//   } catch (err) {
//     console.error(err);
//     res.send('Error: Unable to fetch jobs');
//   }
// });

// function degToRad(deg) {
//   return deg * (Math.PI / 180);
// }















// Example route for handling student form display and submission
app.get('/student_input', (req, res) => {
  res.render('student_input');
});

app.post('/student_input', async (req, res) => {
  const { stud_name, gender, dob, age, address, contact } = req.body;
  try {
    await pool.query('INSERT INTO students (stud_name, gender, dob, age, address, contact) VALUES ($1, $2, $3, $4, $5, $6)', 
    [stud_name, gender, dob, age, address, contact]);
    res.redirect('/student_display');
  } catch (err) {
    console.error(err);
    res.send('Error: Unable to save student data');
  }
});

app.get('/student_display', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students');
    res.render('student_display', { students: result.rows });
  } catch (err) {
    console.error(err);
    res.send('Error: Unable to fetch student data');
  }
});

// Example route for handling grant form display and submission
app.get('/grants_input', (req, res) => {
    res.render('grants_input');
  });
  
  app.post('/grants_input', async (req, res) => {
    const { stud_id, amount, type, awarddate } = req.body;
    try {
      await pool.query('INSERT INTO grants (stud_id, amount, type, awarddate) VALUES ($1, $2, $3, $4)', 
      [stud_id, amount, type, awarddate]);
      res.redirect('/grants_display');
    } catch (err) {
      console.error(err);
      res.send('Error: Unable to save grant data');
    }
  });
  
  app.get('/grants_display', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM grants');
      res.render('grants_display', { grants: result.rows });
    } catch (err) {
      console.error(err);
      res.send('Error: Unable to fetch grant data');
    }
  });
  

// Example route for handling resource form display and submission
app.get('/resources_input', (req, res) => {
    res.render('resources_input');
  });
  
  app.post('/resources_input', async (req, res) => {
    const { res_title, description, resource_type } = req.body;
    try {
      await pool.query('INSERT INTO resources (res_title, description, resource_type) VALUES ($1, $2, $3)', 
      [res_title, description, resource_type]);
      res.redirect('/resources_display');
    } catch (err) {
      console.error(err);
      res.send('Error: Unable to save resource data');
    }
  });
  
  app.get('/resources_display', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM resources');
      res.render('resources_display', { resources: result.rows });
    } catch (err) {
      console.error(err);
      res.send('Error: Unable to fetch resource data');
    }
  });

  
  app.get('/digital_divide_input', (req, res) => {
    res.render('digital_divide_input');
  });
  
  app.post('/digital_divide_input', async (req, res) => {
    const { stud_id, type_of_device, internet_access, internet_quality } = req.body;
    try {
      await pool.query('INSERT INTO digital_divide (stud_id, type_of_device, internet_access, internet_quality) VALUES ($1, $2, $3, $4)', 
      [stud_id, type_of_device, internet_access, internet_quality]);
      res.redirect('/digital_divide_display');
    } catch (err) {
      console.error(err);
      res.send('Error: Unable to save digital divide information');
    }
  });
  
  app.get('/digital_divide_display', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM digital_divide');
      res.render('digital_divide_display', { digitalDivide: result.rows });
    } catch (err) {
      console.error(err);
      res.send('Error: Unable to fetch digital divide information');
    }
  });


// Example route for handling job form display and submission
app.get('/jobs_input', (req, res) => {
    res.render('jobs_input');
  });
  
  app.post('/jobs_input', async (req, res) => {
    const { job_title, requirements, location, company, deadline } = req.body;
    try {
      await pool.query('INSERT INTO jobs (job_title, requirements, location, company, deadline) VALUES ($1, $2, $3, $4, $5)', 
      [job_title, requirements, location, company, deadline]);
      res.redirect('/jobs_display');
    } catch (err) {
      console.error(err);
      res.send('Error: Unable to save job data');
    }
  });
  
  app.get('/jobs_display', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM jobs');
      res.render('jobs_display', { jobs: result.rows });
    } catch (err) {
      console.error(err);
      res.send('Error: Unable to fetch job data');
    }
  });

// Example route for handling mentor form display and submission
app.get('/mentor_input', (req, res) => {
    res.render('mentor_input');
  });
  
  app.post('/mentor_input', async (req, res) => {
    const { ment_name, locality, availability, contact } = req.body;
    try {
      await pool.query('INSERT INTO mentor (ment_name, locality, availability, contact) VALUES ($1, $2, $3, $4)', 
      [ment_name, locality, availability, contact]);
      res.redirect('/mentor_display');
    } catch (err) {
      console.error(err);
      res.send('Error: Unable to save mentor data');
    }
  });
  
  app.get('/mentor_display', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM mentor');
      res.render('mentor_display', { mentors: result.rows });
    } catch (err) {
      console.error(err);
      res.send('Error: Unable to fetch mentor data');
    }
  });
  

// Example route for handling skills form display and submission
app.get('/skills_input', (req, res) => {
    res.render('skills_input');
  });
  
  app.post('/skills_input', async (req, res) => {
    const { skill_type, skill_name, progress ,stud_id} = req.body;
    try {
      await pool.query('INSERT INTO skills (skill_type, skill_name, progress,stud_id) VALUES ($1, $2, $3,$4)', 
      [skill_type, skill_name, progress,stud_id]);
      res.redirect('/skills_display');
    } catch (err) {
      console.error(err);
      res.send('Error: Unable to save skill data');
    }
  });
  
  app.get('/skills_display', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM skills');
      res.render('skills_display', { skills: result.rows });
    } catch (err) {
      console.error(err);
      res.send('Error: Unable to fetch skill data');
    }
  });

  
// Example route for handling loans form display and submission
app.get('/loans_input', (req, res) => {
    res.render('loans_input');
  });
  
  app.post('/loans_input', async (req, res) => {
    const { stud_id, amount, interest_rate, repayment_term, start_date, end_date } = req.body;
    try {
      await pool.query('INSERT INTO loans (stud_id, amount, interest_rate, repayment_term, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6)', 
      [stud_id, amount, interest_rate, repayment_term, start_date, end_date]);
      res.redirect('/loans_display');
    } catch (err) {
      console.error(err);
      res.send('Error: Unable to save loan data');
    }
  });
  
  app.get('/loans_display', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM loans');
      res.render('loans_display', { loans: result.rows });
    } catch (err) {
      console.error(err);
      res.send('Error: Unable to fetch loan data');
    }
  });

  
// Example route for handling incentives form display and submission
app.get('/incentives_input', (req, res) => {
    res.render('incentives_input');
  });
  
  app.post('/incentives_input', async (req, res) => {
    const { stud_id, type, description, awarddate } = req.body;
    try {
      await pool.query('INSERT INTO incentives (stud_id, type, description, awarddate) VALUES ($1, $2, $3, $4)', 
      [stud_id, type, description, awarddate]);
      res.redirect('/incentives_display');
    } catch (err) {
      console.error(err);
      res.send('Error: Unable to save incentive data');
    }
  });
  
  app.get('/incentives_display', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM incentives');
      res.render('incentives_display', { incentives: result.rows });
    } catch (err) {
      console.error(err);
      res.send('Error: Unable to fetch incentive data');
    }
  });

  
  app.get('/query1', async (req, res) => {
    try {
      const result = await pool.query(`
      SELECT s.stud_name, g.amount, g.awarddate
      FROM students s
      JOIN grants g ON s.stud_id = g.stud_id
      `);
      res.render('query1', { grants: result.rows });
    } catch (err) {
      console.error(err);
      res.send('Error: Unable to fetch query results');
    }
  });
  

  app.get('/query2', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT s.stud_name, l.amount, l.interest_rate, l.repayment_term
        FROM students s
        JOIN loans l ON s.stud_id = l.stud_id
      `);
      res.render('query2', { loans: result.rows });
    } catch (err) {
      console.error(err);
      res.send('Error: Unable to fetch query results');
    }
  });
  
  app.get('/query3', async (req, res) => {
    const { location } = req.query;
    try {
      const result = await pool.query(`
        SELECT job_title, requirements, company, deadline
        FROM jobs
        WHERE location = $1
      `, [location]);
      res.render('query3', { jobs: result.rows, location });
    } catch (err) {
      console.error(err);
      res.send('Error: Unable to fetch query results');
    }
  });


  app.get('/query4', async (req, res) => {
    const { locality } = req.query;
    try {
      const result = await pool.query(`
        SELECT ment_name, contact
        FROM mentor
        WHERE locality = $1
      `, [locality]);
      res.render('query4', { mentors: result.rows, locality });
    } catch (err) {
      console.error(err);
      res.send('Error: Unable to fetch query results');
    }
  });
  

  app.get('/query5', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT s.stud_name, sk.skill_name, sk.progress
        FROM students s
        JOIN skills sk ON s.stud_id = sk.stud_id
      `);
      res.render('query5', { skills: result.rows });
    } catch (err) {
      console.error(err);
      res.send('Error: Unable to fetch query results');
    }
  });

  app.get('/query6', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT s.stud_name, i.type, i.description, i.awarddate
        FROM students s
        JOIN incentives i ON s.stud_id = i.stud_id
      `);
      res.render('query6', { incentives: result.rows });
    } catch (err) {
      console.error(err);
      res.send('Error: Unable to fetch query results');
    }
  });

  app.get('/query7', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT s.stud_name,
               (SELECT COALESCE(SUM(amount), 0) FROM grants WHERE stud_id = s.stud_id) AS total_grants,
               (SELECT COALESCE(SUM(amount), 0) FROM loans WHERE stud_id = s.stud_id) AS total_loans
        FROM students s
      `);
      res.render('query7', { students: result.rows });
    } catch (err) {
      console.error(err);
      res.send('Error: Unable to fetch query results');
    }
  });
  
  app.get('/query8', async (req, res) => {
    try {
      const result = await pool.query(`
      SELECT m.ment_name, m.locality,
      (SELECT COUNT(*) FROM students s WHERE s.address = m.locality) AS num_of_students
        FROM mentor m
      `);
      res.render('query8', { mentors: result.rows });
    } catch (err) {
      console.error(err);
      res.send('Error: Unable to fetch query results');
    }
  });

  app.get('/query9', async (req, res) => {
    try {
      const result = await pool.query(`
      SELECT s.stud_name, s.contact
      FROM students s
      JOIN digital_divide d ON s.stud_id = d.stud_id
      WHERE d.internet_access = 'no';      
      `);
      res.render('query9', { students: result.rows });
    } catch (err) {
      console.error(err);
      res.send('Error: Unable to fetch query results');
    }
  });
  
  
  app.get('/query10', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT s.stud_name, s.contact
        FROM students s
        JOIN skills sk ON s.stud_id = sk.stud_id
        WHERE sk.progress = 'completed'
        GROUP BY s.stud_id, s.stud_name, s.contact
        HAVING COUNT(*) >= 2;
      `);
      res.render('query10', { students: result.rows });
    } catch (err) {
      console.error(err);
      res.send('Error: Unable to fetch query results');
    }
  });
  

// Repeat similar routes for each table (resources, grants, loans, incentives, jobs, mentor, skills, digital_divide)

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
