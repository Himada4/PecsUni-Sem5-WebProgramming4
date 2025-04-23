import * as fs from "fs";
import {open} from "sqlite";
import sqlite3 from "sqlite3";

const dbPath = "src/lib/databaseManagement/database.db"

async function openDBConnection(path: string, schema: string) {
    const exists = fs.existsSync(path);
    const db = await open({
        filename: path,
        driver: sqlite3.Database
    });

    if (!exists) {
        // If the database doesn't exist, create tables
        await db.exec(schema);
    }

    // Enable foreign key constraints
    await db.exec("PRAGMA foreign_keys = ON;");

    return db;
}

const schema = `
-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Auth Table
CREATE TABLE IF NOT EXISTS auth (
    user_id INTEGER PRIMARY KEY,
    password_hash TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create Recipes Table
CREATE TABLE IF NOT EXISTS recipes (
     recipe_id INTEGER PRIMARY KEY AUTOINCREMENT,
     user_id INTEGER,
     title TEXT NOT NULL,
     description TEXT NOT NULL,
     ingredients TEXT NOT NULL,
     instructions TEXT NOT NULL,
     thumbnail_url TEXT,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
`;

export const db = await openDBConnection(dbPath, schema);


/*
CREATE TABLE IF NOT EXISTS ingredient_nutrition (
    id INTEGER PRIMARY KEY AUTOINCREMENT,         -- Unique identifier for each nutrition record
    ingredient_id INT NOT NULL,                -- Reference to your ingredient table (foreign key if exists)
    ingredient_name VARCHAR(255) NOT NULL,     -- Name of the ingredient (for readability)

    -- Macronutrients (per serving)
    calories FLOAT,                            -- Total calories (kcal)
    protein FLOAT,                             -- Protein (g)
    fat FLOAT,                                 -- Total fat (g)
    saturated_fat FLOAT,                       -- Saturated fat (g)
    carbohydrates FLOAT,                       -- Total carbohydrates (g)
    sugar FLOAT,                               -- Sugar (g)
    fiber FLOAT,                               -- Fiber (g)

    -- Other relevant nutrients
    cholesterol FLOAT,                         -- Cholesterol (mg)
    sodium FLOAT,                              -- Sodium (mg)
    potassium FLOAT,                           -- Potassium (mg)
    iron FLOAT,                                -- Iron (mg)
    vitamin_b12 FLOAT,                         -- Vitamin B12 (µg)
    vitamin_b6 FLOAT,                          -- Vitamin B6 (mg)
    vitamin_c FLOAT,                           -- vitamin C (mg)
    magnesium FLOAT,                           -- Magnesium (mg)
    phosphorus FLOAT,                          -- Phosphorus (mg)
    selenium FLOAT,                            -- Selenium (µg)

    -- Serving info
    serving_size FLOAT,                        -- The amount of the serving (e.g. 200)
    serving_unit VARCHAR(50) DEFAULT 'g',      -- Unit for the serving (e.g. g, oz, cup)

    -- Timestamp for caching management
    fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP  -- When this data was fetched
);
 */

