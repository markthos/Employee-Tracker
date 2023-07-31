// Import and require packages
const inquirer = require('inquirer');
const mysql = require('mysql2');
const express = require('express');

// Connect to mysql database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'spamANDeggs',
        database: 'employee_db'
    },
    console.log('Connected to the employee_db database.')
);

