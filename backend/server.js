require('dotenv').config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { pool, testConnection, initDatabase } = require("./config/database");

// Import routes
const countryRoutes = require('./routes/countryRoutes');
const stateRoutes = require('./routes/stateRoutes');
const districtRoutes = require('./routes/districtRoutes');
const zoneRoutes = require('./routes/zoneRoutes');
const superadminRoutes = require('./routes/superadminRoutes');
const agentRoutes = require('./routes/agentRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const catagoriesRoutes = require('./routes/CatagoriesRoutes');
const unitMasterRoutes = require('./routes/UnitMasterRoutes');
const addonsRoutes = require('./routes/AddonsRoutes');
const menuMasterRoutes = require('./routes/MenumasterRoutes');
const menuDetailsRoutes = require('./routes/MenuDetailsRoutes');
const menuaddonRoutes = require('./routes/MenuaddonRoutes');



const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database (MySQL)
(async () => {
    const connected = await testConnection();
    if (connected) {
        await initDatabase();
        console.log("📊 MySQL Database initialized successfully!");

        // Check existing tables
        const [tables] = await pool.query("SHOW TABLES;");
        console.log("Existing tables:", tables);

        // Log contents of menumaster table
        const [menuItems] = await pool.query("SELECT * FROM menumaster;");
        console.log("Menu items in menumaster:", menuItems);
    } else {
        console.error("❌ Failed to connect to MySQL database!");
        process.exit(1);
    }
})();

// Routes
app.use('/api/countries', countryRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/districts', districtRoutes);
app.use('/api/zones', zoneRoutes);
app.use('/api/superadmin', superadminRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/categories', catagoriesRoutes);
app.use('/api/units', unitMasterRoutes);
app.use('/api/addons', addonsRoutes);
app.use('/api/menumaster', menuMasterRoutes);
app.use('/api/menudetails', menuDetailsRoutes);
app.use('/api/menuaddons', menuaddonRoutes);

// Basic route
app.get("/", (req, res) => {
    res.json({ 
        message: "Lodging Management API is running with MySQL!",
        status: "Database connected successfully",
        endpoints: {
            countries: "/api/countries",
            states: "/api/states",
            districts: "/api/districts",
            zones: "/api/zones",
            superadmin: "/api/superadmin",
            agents: "/api/agents",
            hotels: "/api/hotels",
            categories: "/api/categories",
            units: "/api/units",
            addons: "/api/addons",
            menus: "/api/menumaster",
            menuDetails: "/api/menudetails",
            menuAddons: "/api/menuaddons"
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
