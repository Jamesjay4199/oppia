// Copyright 2020 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Constants for the Oppia about page.
 */

export class AboutPageConstants {
  // These credits should not be changed directly. If any change is
  // made to structure/formatting, the respective constants
  // CREDITS_START_LINE, CREDITS_END_LINE and CREDITS_INDENT should be
  // updated in update_changelog_and_credits.py file. If the patterns do
  // not match, update_changelog_and_credits_test will fail.
  public static CREDITS_CONSTANTS = [
    'Aadya Mishra',
    'Aaron Zuspan',
    'Aashish Gaba',
    'Aashish Singh',
    'Abeer Khan',
    'Abhay Gupta',
    'Abhay Raghuwanshi',
    'Abhay Raizada',
    'Abhijit Suresh',
    'Abhimanyu Thakre',
    'Abhishek Arya',
    'Abhishek Kumar',
    'Abhishek Uniyal',
    'Abraham Mgowano',
    'Acash Mkj',
    'Adarsh Kumar',
    'Aditya Jain',
    'Ajay Sharma',
    'Ajo John',
    'Akshay Anand',
    'Alex Gower',
    'Alexandra Wu',
    'Allan Zhou',
    'Alluri Harshit Varma',
    'Amanda Rodriguez',
    'Amey Kudari',
    'Amit Deutsch',
    'Ana Francisca Bernardo',
    'Andrew Low',
    'Andrey Mironyuk',
    'Angela Park',
    'Anggoro Dewanto',
    'Anish V Badri',
    'Ankita Saxena',
    'Anmol Shukla',
    'Anthony Alridge',
    'Anthony Zheng',
    'Anubhav Sinha',
    'Anurag Thakur',
    'Apurv Bajaj',
    'Areesha Tariq',
    'Arnesh Agrawal',
    'Arpan Banerjee',
    'Arun Kumar',
    'Arunabh Ghosh',
    'Ashish Verma',
    'Ashmeet Singh',
    'Ashutosh Singla',
    'Assem Yeskabyl',
    'Aubrey Wells',
    'Aung Hein Oo',
    'Avijit Gupta',
    'Barnabas Makonda',
    'Ben Henning',
    'Ben Targan',
    'Bill Morrisson',
    'BJ Voth',
    'Bolaji Fatade',
    'Boyd Y. Ching',
    'Brenton Briggs',
    'Brian Lin',
    'Brian Rodriguez',
    'Cathleen Huang',
    'Charisse De Torres',
    'Chase Albert',
    'Chen Shenyue',
    'Chin Zhan Xiong',
    'Chris Skalnik',
    'Christopher Tao',
    'Cihan Bebek',
    'Connie Chow',
    'Corey Hunter',
    'Céline Deknop',
    'Darin Nguyen',
    'Dawson Eliasen',
    'Debanshu Bhaumik',
    'Deepank Agarwal',
    'Denis Samokhvalov',
    'Dharmesh Poddar',
    'Diana Chen',
    'Divyadeep Singh',
    'Domenico Vitarella',
    'Edward Allison',
    'Elizabeth Kemp',
    'Eric Lou',
    'Eric Yang',
    'Estelle Lee',
    'Fang You',
    'Felicity Zhao',
    'Florin Balint',
    'Frederik Creemers',
    'Gabriel Fuentes',
    'Gagan Suneja',
    'Gautam Verma',
    'Geet Choudhary',
    'Grace Guo',
    'Hamlet Villa',
    'Hamza Chandad',
    'Hanan Mufti',
    'Haresh Khanna',
    'Harsh Khajuria',
    'Hema Sundara Rao Ginni',
    'Henry Phu',
    'Himanshu Aggarwal',
    'Himanshu Dixit',
    'Hitesh Sharma',
    'Huong Le',
    'Ian Luttrell',
    'Ishan Singh',
    'Jackson Wu',
    'Jacob Davis',
    'Jacob Li Peng Cheng',
    'Jakub Osika',
    'James James John',
    'James Xu',
    'Jamie Lau',
    'Jared Silver',
    'Jasmine Rider',
    'Jasper Deng',
    'Jaysinh Shukla',
    'Jenna Mandel',
    'Jeremy Emerson',
    'Jerry Chen',
    'Jim Zhan',
    'John Glennon',
    'John Prince Mesape',
    'Jordan Cockles',
    'Jordan Stapinski',
    'Joseph Fedota',
    'Joshua Cano',
    'Joshua Lan',
    'Joshua Lusk',
    'Joydeep Mukherjee',
    'Juan Saba',
    'Justin Du',
    'Jérôme (zolk232)',
    'K.N. Anantha Nandanan',
    'Karen Rustad',
    'Kartikey Pandey',
    'Kashif Jamal Soofi',
    'Kathryn Patterson',
    'Kefeh Collins',
    'Kenneth Ho',
    'Kerry Wang',
    'Keshav Bathla',
    'Keshav Gupta',
    'Kevin Conner',
    'Kevin Lee',
    'Kevin Thomas',
    'Kiran Konduru',
    'Koji Ashida',
    'Konstantinos Kagkelidis',
    'Krishna Rao',
    'Kristin Anthony',
    'Kumari Shalini',
    'Kunal Garg',
    'Lakshay Angrish',
    'Laura Kinkead',
    'Lorrany Azevedo',
    'Luis Ulloa',
    'Lunrong Chen',
    'Madiyar Aitbayev',
    'Mamat Rahmat',
    'Manas Tungare',
    'Manoj Mohan',
    'Marcel Schmittfull',
    'Mariana Zangrossi',
    'Mark Cabanero',
    'Mark Halpin',
    'Martin Smithurst',
    'Maurício Meneghini Fauth',
    'Mert Degirmenci',
    'Michael Anuzis',
    'Michael Mossey',
    'Michael Orwin',
    'Michael Wagner',
    'Milagro Teruel',
    'Min Tan',
    'Mohammad Shahebaz',
    'Mohammad Zaman',
    'Mohit Gupta',
    'Mohit Musaddi',
    'Mungo Dewar',
    'Nadin Tamer',
    'Nalin Bhardwaj',
    'Nalin Chhibber',
    'Namuli Joyce',
    'Naveen Kumar Shukla',
    'Netaji Kancharapu',
    'Nikhil Handa',
    'Nikhil Prakash',
    'Nikhil Sangwan',
    'Nimalen Sivapalan',
    'Nishant Mittal',
    'Nisheal John',
    'Nithesh N. Hariharan',
    'Nitish Bansal',
    'Oskar Cieslik',
    'Oswell Chan',
    'Owen Parry',
    'Ozan Filiz',
    'Paloma Oliveira',
    'Parth Bhoiwala',
    'Phil Wagner',
    'Philip Hayes',
    'Phillip Moulton',
    'Piyush Agrawal',
    'Pranav Siddharth S',
    'Prasanna Patil',
    'Pratik Katte',
    'Prayush Dawda',
    'Pulkit Aggarwal',
    'Pulkit Gera',
    'Rafay Ghafoor',
    'Rafał Kaszuba',
    'Rahul Gurung',
    'Rahul Modi',
    'Raine Hoover',
    'Rajan Garg',
    'Rajat Patwa',
    'Rajat Talesra',
    'Rajendra Kadam',
    'Rajitha Warusavitarana',
    'Rakshit Kumar',
    'Raymond Tso',
    'Reinaldo Aguiar',
    'Reto Brunner',
    'Richard Cho',
    'Rishabh Rawat',
    'Rishav Chakraborty',
    'Ritik Kumar',
    'Rohan Batra',
    'Rohan Gulati',
    'Rohit Katlaa',
    'Ross Strader',
    'Rudra Sadhu',
    'Sachin Gopal',
    'Saeed Jassani',
    'Safwan Mansuri',
    'Sagang Wee',
    'Sagar Manohar',
    'Samara Trilling',
    'Samriddhi Mishra',
    'Sandeep Dubey',
    'Sandeep Patel',
    'Santos Hernandez',
    'Sanyam Khurana',
    'Sasa Cocic-Banjanac',
    'Satish Boggarapu',
    'Satmeet Ubhi',
    'Satwik Kansal',
    'Satyam Bhalla',
    'Satyam Yadav',
    'Saurav Pratihar',
    'Scott Brenner',
    'Scott Junner',
    'Scott Roberts',
    'Sean Anthony Riordan',
    'Sean Lip',
    'Sebastian Zangaro',
    'Seth Beckman',
    'Seth Saloni',
    'Shafqat Dulal',
    'Shantanu Bhowmik',
    'Sharif Shaker',
    'Shiqi Wu',
    'Shitong Shou',
    'Shiva Krishna Yadav',
    'Shivan Trivedi',
    'Shivansh Bajaj',
    'Shivansh Dhiman',
    'Shivansh Rakesh',
    'Shouvik Roy',
    'Shubha Gupta',
    'Shubha Rajan',
    'Shubham Bansal',
    'Shuta Suzuki',
    'Siddhant Khandelwal',
    'Siddhant Srivastav',
    'Siddharth Batra',
    'Soumyo Dey',
    'Sourab Jha',
    'Sourav Badami',
    'Sourav Singh',
    'Sreenivasulu Giritheja',
    'Srijan Reddy',
    'Srikar Ch',
    'Stefanie Muroya Lei',
    'Stephanie Federwisch',
    'Stephen Chiang',
    'Sudhanva MG',
    'Sudipta Gyan Prakash Pradhan',
    'Sumit Paroothi',
    'Tanmay Mathur',
    'Tarashish Mishra',
    'Teddy Marchildon',
    'Tezuesh Varshney',
    'Tia Jin',
    'Timothy Cyrus',
    'Tonatiuh Garcia',
    'Tony Afula',
    'Tony Jiang',
    'Tracy Homer',
    'Travis Shafer',
    'Truong Kim',
    'Tuguldur Baigalmaa',
    'Tyler Ishikawa',
    'Ujjwal Gulecha',
    'Umesh Singla',
    'Utkarsh Dixit',
    'Varun Tandon',
    'Vasu Tomar',
    'Vibhor Agarwal',
    'Viet Tran Quoc Hoang',
    'Vijay Patel',
    'Viktor Pishuk',
    'Vinayak Vishwanath Gosain',
    'Vinit Dantkale',
    'Vinita Murthi',
    'Viraj Prabhu',
    'Vishal Desai',
    'Vishal Gupta',
    'Vishal Joisar',
    'Vishnu M',
    'Vojtěch Jelínek',
    'Vuyisile Ndlovu',
    'Will Li',
    'Wilson Hong',
    'Xinyu Wu',
    'Xuân (Sean) Lương',
    'Yana Malysheva',
    'Yang Lu',
    'Yash Jipkate',
    'Yash Ladha',
    'Yi Yan',
    'Yiming Pan',
    'Yogesh Sharma',
    'Yousef Hamza',
    'Yuan Gu',
    'Yuliang',
    'Zach Puller',
    'Zach Wiebesiek',
    'Zachery Vekovius',
    'Zoe Madden-Wood',
  ];
}
