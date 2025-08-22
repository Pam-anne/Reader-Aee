// src/app/bookcatalog/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, BookOpen, Clock, User, AlertCircle, Loader2, ChevronDown, ChevronUp, Star } from 'lucide-react';

// Define TypeScript interfaces
interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  publisher: string;
  publishedYear: number;
  isbn: string;
  pages: number;
  rating: string;
  isAvailable: boolean;
  description: string;
  coverColor: string;
  borrowedBy: string | null;
  dueDate: string | null;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  borrowedBooks: string[];
}

// Complete mock data for 50 books with your original styling
const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    publisher: 'Scribner',
    publishedYear: 1925,
    isbn: '978-0-7432-7356-5',
    pages: 180,
    rating: '4.5',
    isAvailable: true,
    description: 'A classic novel about the American Dream in the Jazz Age',
    coverColor: 'bg-gradient-to-br from-blue-400 to-blue-600',
    borrowedBy: null,
    dueDate: null
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    publisher: 'J.B. Lippincott & Co.',
    publishedYear: 1960,
    isbn: '978-0-06-112008-4',
    pages: 281,
    rating: '4.8',
    isAvailable: false,
    description: 'A story about racial inequality and moral growth in the American South',
    coverColor: 'bg-gradient-to-br from-green-400 to-green-600',
    borrowedBy: 'John Doe',
    dueDate: '2024-01-15'
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    genre: 'Fiction',
    publisher: 'Secker & Warburg',
    publishedYear: 1949,
    isbn: '978-0-452-28423-4',
    pages: 328,
    rating: '4.7',
    isAvailable: true,
    description: 'A dystopian social science fiction novel about totalitarian control',
    coverColor: 'bg-gradient-to-br from-red-400 to-red-600',
    borrowedBy: null,
    dueDate: null
  },
  {
    id: '4',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Fiction',
    publisher: 'T. Egerton',
    publishedYear: 1813,
    isbn: '978-0-14-143951-8',
    pages: 432,
    rating: '4.6',
    isAvailable: true,
    description: 'A romantic novel of manners that depicts the emotional development',
    coverColor: 'bg-gradient-to-br from-pink-400 to-pink-600',
    borrowedBy: null,
    dueDate: null
  },
  {
    id: '5',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    genre: 'Fiction',
    publisher: 'Little, Brown and Company',
    publishedYear: 1951,
    isbn: '978-0-316-76948-0',
    pages: 234,
    rating: '4.3',
    isAvailable: false,
    description: 'A story about teenage rebellion and alienation in New York City',
    coverColor: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    borrowedBy: 'Sarah Smith',
    dueDate: '2024-01-18'
  },
  {
    id: '6',
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    publisher: 'Allen & Unwin',
    publishedYear: 1954,
    isbn: '978-0-618-64015-7',
    pages: 1178,
    rating: '4.9',
    isAvailable: true,
    description: 'An epic high fantasy adventure set in Middle-earth',
    coverColor: 'bg-gradient-to-br from-purple-400 to-purple-600',
    borrowedBy: null,
    dueDate: null
  },
  {
    id: '7',
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    genre: 'Fantasy',
    publisher: 'Bloomsbury',
    publishedYear: 1997,
    isbn: '978-0-7475-3269-6',
    pages: 223,
    rating: '4.8',
    isAvailable: true,
    description: 'The first novel in the Harry Potter series',
    coverColor: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
    borrowedBy: null,
    dueDate: null
  },
  {
    id: '8',
    title: 'The Da Vinci Code',
    author: 'Dan Brown',
    genre: 'Mystery',
    publisher: 'Doubleday',
    publishedYear: 2003,
    isbn: '978-0-385-50420-5',
    pages: 454,
    rating: '4.2',
    isAvailable: false,
    description: 'A mystery thriller novel about a conspiracy within the Catholic Church',
    coverColor: 'bg-gradient-to-br from-gray-400 to-gray-600',
    borrowedBy: 'Mike Johnson',
    dueDate: '2024-01-20'
  },
  {
    id: '9',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    genre: 'Fiction',
    publisher: 'HarperCollins',
    publishedYear: 1988,
    isbn: '978-0-06-231500 7',
    pages: 208,
    rating: '4.5',
    isAvailable: true,
    description: 'A philosophical novel about following your dreams',
    coverColor: 'bg-gradient-to-br from-orange-400 to-orange-600',
    borrowedBy: null,
    dueDate: null
  },
  {
    id: '10',
    title: 'The Hunger Games',
    author: 'Suzanne Collins',
    genre: 'Science Fiction',
    publisher: 'Scholastic',
    publishedYear: 2008,
    isbn: '978-0-439-02352-8',
    pages: 374,
    rating: '4.7',
    isAvailable: true,
    description: 'A dystopian novel set in a post-apocalyptic nation',
    coverColor: 'bg-gradient-to-br from-red-500 to-red-700',
    borrowedBy: null,
    dueDate: null
  },
  {
    id: '11',
    title: 'The Shining',
    author: 'Stephen King',
    genre: 'Horror',
    publisher: 'Doubleday',
    publishedYear: 1977,
    isbn: '978-0-385-12167-5',
    pages: 447,
    rating: '4.6',
    isAvailable: true,
    description: 'A horror novel about a family\'s winter in an isolated hotel',
    coverColor: 'bg-gradient-to-br from-red-600 to-red-800',
    borrowedBy: null,
    dueDate: null
  },
  {
    id: '12',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    publisher: 'Allen & Unwin',
    publishedYear: 1937,
    isbn: '978-0-618-64015-7',
    pages: 310,
    rating: '4.8',
    isAvailable: false,
    description: 'A fantasy novel about Bilbo Baggins\' adventure',
    coverColor: 'bg-gradient-to-br from-green-500 to-green-700',
    borrowedBy: 'Emma Wilson',
    dueDate: '2024-01-22'
  },
{
  id: '13',
  title: 'Jane Eyre',
  author: 'Charlotte Brontë',
  genre: 'Fiction',
  publisher: 'Smith, Elder & Co.',
  publishedYear: 1847,
  isbn: '978-0-14-243720-9',
  pages: 500,
  rating: '4.4',
  isAvailable: true,
  description: 'A coming-of-age story featuring a strong female protagonist.',
  coverColor: 'bg-gradient-to-br from-purple-300 to-purple-500',
  borrowedBy: null,
  dueDate: null
},
{
  id: '14',
  title: 'Moby-Dick',
  author: 'Herman Melville',
  genre: 'Fiction',
  publisher: 'Harper & Brothers',
  publishedYear: 1851,
  isbn: '978-0-14-243724-7',
  pages: 635,
  rating: '4.1',
  isAvailable: true,
  description: 'A whaling voyage turns into an obsession with a legendary whale.',
  coverColor: 'bg-gradient-to-br from-blue-300 to-blue-500',
  borrowedBy: null,
  dueDate: null
},
{
  id: '15',
  title: 'Brave New World',
  author: 'Aldous Huxley',
  genre: 'Science Fiction',
  publisher: 'Chatto & Windus',
  publishedYear: 1932,
  isbn: '978-0-06-085052-4',
  pages: 311,
  rating: '4.2',
  isAvailable: false,
  description: 'A dystopian future where society is engineered for stability.',
  coverColor: 'bg-gradient-to-br from-green-300 to-green-500',
  borrowedBy: 'Alex Kim',
  dueDate: '2024-01-25'
},
{
  id: '16',
  title: 'Wuthering Heights',
  author: 'Emily Brontë',
  genre: 'Fiction',
  publisher: 'Thomas Cautley Newby',
  publishedYear: 1847,
  isbn: '978-0-14-143955-6',
  pages: 416,
  rating: '4.3',
  isAvailable: true,
  description: 'A tale of passion and revenge set on the Yorkshire moors.',
  coverColor: 'bg-gradient-to-br from-gray-300 to-gray-500',
  borrowedBy: null,
  dueDate: null
},
{
  id: '17',
  title: 'The Odyssey',
  author: 'Homer',
  genre: 'Fiction',
  publisher: 'Ancient Greece',
  publishedYear: -800,
  isbn: '978-0-14-026886-7',
  pages: 541,
  rating: '4.6',
  isAvailable: true,
  description: 'The epic journey of Odysseus returning home from war.',
  coverColor: 'bg-gradient-to-br from-yellow-300 to-yellow-500',
  borrowedBy: null,
  dueDate: null
},
{
  id: '18',
  title: 'Dracula',
  author: 'Bram Stoker',
  genre: 'Horror',
  publisher: 'Archibald Constable and Company',
  publishedYear: 1897,
  isbn: '978-0-14-143984-6',
  pages: 418,
  rating: '4.2',
  isAvailable: false,
  description: 'The classic vampire novel that started it all.',
  coverColor: 'bg-gradient-to-br from-red-700 to-black',
  borrowedBy: 'Linda Lee',
  dueDate: '2024-01-28'
},
{
  id: '19',
  title: 'Frankenstein',
  author: 'Mary Shelley',
  genre: 'Horror',
  publisher: 'Lackington, Hughes, Harding, Mavor & Jones',
  publishedYear: 1818,
  isbn: '978-0-14-143947-1',
  pages: 280,
  rating: '4.3',
  isAvailable: true,
  description: 'A scientist creates a living being with unintended consequences.',
  coverColor: 'bg-gradient-to-br from-green-700 to-gray-800',
  borrowedBy: null,
  dueDate: null
},
{
  id: '20',
  title: 'The Picture of Dorian Gray',
  author: 'Oscar Wilde',
  genre: 'Fiction',
  publisher: 'Ward, Lock & Co.',
  publishedYear: 1890,
  isbn: '978-0-14-143957-0',
  pages: 254,
  rating: '4.4',
  isAvailable: true,
  description: 'A man remains young while his portrait ages.',
  coverColor: 'bg-gradient-to-br from-indigo-300 to-indigo-500',
  borrowedBy: null,
  dueDate: null
},
{
  id: '21',
  title: 'The Adventures of Sherlock Holmes',
  author: 'Arthur Conan Doyle',
  genre: 'Mystery',
  publisher: 'George Newnes',
  publishedYear: 1892,
  isbn: '978-0-14-103435-4',
  pages: 307,
  rating: '4.7',
  isAvailable: true,
  description: 'A collection of twelve stories featuring Sherlock Holmes.',
  coverColor: 'bg-gradient-to-br from-gray-400 to-blue-800',
  borrowedBy: null,
  dueDate: null
},
{
  id: '22',
  title: 'The Chronicles of Narnia',
  author: 'C.S. Lewis',
  genre: 'Fantasy',
  publisher: 'Geoffrey Bles',
  publishedYear: 1950,
  isbn: '978-0-06-623850-0',
  pages: 767,
  rating: '4.8',
  isAvailable: false,
  description: 'A magical world discovered through a wardrobe.',
  coverColor: 'bg-gradient-to-br from-blue-200 to-blue-400',
  borrowedBy: 'Brian Oduor',
  dueDate: '2024-02-01'
},
{
  id: '23',
  title: 'The Fault in Our Stars',
  author: 'John Green',
  genre: 'Romance',
  publisher: 'Dutton Books',
  publishedYear: 2012,
  isbn: '978-0-525-47881-2',
  pages: 313,
  rating: '4.5',
  isAvailable: true,
  description: 'A love story between two teenagers with cancer.',
  coverColor: 'bg-gradient-to-br from-blue-300 to-pink-400',
  borrowedBy: null,
  dueDate: null
},
{
  id: '24',
  title: 'Gone Girl',
  author: 'Gillian Flynn',
  genre: 'Mystery',
  publisher: 'Crown Publishing Group',
  publishedYear: 2012,
  isbn: '978-0-307-58836-4',
  pages: 422,
  rating: '4.1',
  isAvailable: true,
  description: 'A psychological thriller about a missing wife.',
  coverColor: 'bg-gradient-to-br from-gray-700 to-gray-900',
  borrowedBy: null,
  dueDate: null
},
{
  id: '25',
  title: 'The Girl with the Dragon Tattoo',
  author: 'Stieg Larsson',
  genre: 'Mystery',
  publisher: 'Norstedts Förlag',
  publishedYear: 2005,
  isbn: '978-0-307-45454-6',
  pages: 465,
  rating: '4.3',
  isAvailable: false,
  description: 'A journalist and hacker investigate a disappearance.',
  coverColor: 'bg-gradient-to-br from-yellow-700 to-black',
  borrowedBy: 'Grace Wanjiku',
  dueDate: '2024-02-05'
},
{
  id: '26',
  title: 'A Game of Thrones',
  author: 'George R.R. Martin',
  genre: 'Fantasy',
  publisher: 'Bantam Books',
  publishedYear: 1996,
  isbn: '978-0-553-10354-0',
  pages: 694,
  rating: '4.7',
  isAvailable: true,
  description: 'Noble families vie for control of the Iron Throne.',
  coverColor: 'bg-gradient-to-br from-blue-900 to-gray-700',
  borrowedBy: null,
  dueDate: null
},
{
  id: '27',
  title: 'The Kite Runner',
  author: 'Khaled Hosseini',
  genre: 'Fiction',
  publisher: 'Riverhead Books',
  publishedYear: 2003,
  isbn: '978-1-59448-000-3',
  pages: 371,
  rating: '4.6',
  isAvailable: true,
  description: 'A story of friendship and redemption in Afghanistan.',
  coverColor: 'bg-gradient-to-br from-orange-300 to-orange-600',
  borrowedBy: null,
  dueDate: null
},
{
  id: '28',
  title: 'Life of Pi',
  author: 'Yann Martel',
  genre: 'Fiction',
  publisher: 'Knopf Canada',
  publishedYear: 2001,
  isbn: '978-0-15-602732-8',
  pages: 319,
  rating: '4.4',
  isAvailable: true,
  description: 'A boy survives a shipwreck with a Bengal tiger.',
  coverColor: 'bg-gradient-to-br from-blue-200 to-orange-200',
  borrowedBy: null,
  dueDate: null
},
{
  id: '29',
  title: 'The Book Thief',
  author: 'Markus Zusak',
  genre: 'Fiction',
  publisher: 'Picador',
  publishedYear: 2005,
  isbn: '978-0-375-84220-7',
  pages: 552,
  rating: '4.5',
  isAvailable: false,
  description: 'A young girl steals books in Nazi Germany.',
  coverColor: 'bg-gradient-to-br from-yellow-400 to-brown-600',
  borrowedBy: 'Peter Otieno',
  dueDate: '2024-02-10'
},
{
  id: '30',
  title: 'The Handmaid\'s Tale',
  author: 'Margaret Atwood',
  genre: 'Science Fiction',
  publisher: 'McClelland and Stewart',
  publishedYear: 1985,
  isbn: '978-0-385-49081-9',
  pages: 311,
  rating: '4.3',
  isAvailable: true,
  description: 'A dystopian society where women are subjugated.',
  coverColor: 'bg-gradient-to-br from-red-200 to-red-500',
  borrowedBy: null,
  dueDate: null
},
{
  id: '31',
  title: 'The Road',
  author: 'Cormac McCarthy',
  genre: 'Science Fiction',
  publisher: 'Alfred A. Knopf',
  publishedYear: 2006,
  isbn: '978-0-307-26543-2',
  pages: 287,
  rating: '4.2',
  isAvailable: true,
  description: 'A father and son journey through a post-apocalyptic world.',
  coverColor: 'bg-gradient-to-br from-gray-600 to-gray-900',
  borrowedBy: null,
  dueDate: null
},
{
  id: '32',
  title: 'The Color Purple',
  author: 'Alice Walker',
  genre: 'Fiction',
  publisher: 'Harcourt Brace Jovanovich',
  publishedYear: 1982,
  isbn: '978-0-15-602835-6',
  pages: 295,
  rating: '4.4',
  isAvailable: true,
  description: 'A story of African-American women in early 20th-century Georgia.',
  coverColor: 'bg-gradient-to-br from-purple-200 to-purple-600',
  borrowedBy: null,
  dueDate: null
},
{
  id: '33',
  title: 'The Secret Garden',
  author: 'Frances Hodgson Burnett',
  genre: 'Fiction',
  publisher: 'Frederick A. Stokes',
  publishedYear: 1911,
  isbn: '978-0-14-243705-5',
  pages: 331,
  rating: '4.3',
  isAvailable: true,
  description: 'A lonely girl discovers a hidden, magical garden.',
  coverColor: 'bg-gradient-to-br from-green-200 to-green-500',
  borrowedBy: null,
  dueDate: null
},
{
  id: '34',
  title: 'Little Women',
  author: 'Louisa May Alcott',
  genre: 'Fiction',
  publisher: 'Roberts Brothers',
  publishedYear: 1868,
  isbn: '978-0-14-240876-5',
  pages: 759,
  rating: '4.5',
  isAvailable: false,
  description: 'The lives of four sisters growing up during the Civil War.',
  coverColor: 'bg-gradient-to-br from-pink-200 to-pink-500',
  borrowedBy: 'Mary Njeri',
  dueDate: '2024-02-15'
},
{
  id: '35',
  title: 'The Count of Monte Cristo',
  author: 'Alexandre Dumas',
  genre: 'Fiction',
  publisher: 'Penguin Classics',
  publishedYear: 1844,
  isbn: '978-0-14-044926-7',
  pages: 1276,
  rating: '4.7',
  isAvailable: true,
  description: 'A tale of betrayal, revenge, and redemption.',
  coverColor: 'bg-gradient-to-br from-gray-300 to-gray-600',
  borrowedBy: null,
  dueDate: null
},
{
  id: '36',
  title: 'The Hitchhiker\'s Guide to the Galaxy',
  author: 'Douglas Adams',
  genre: 'Science Fiction',
  publisher: 'Pan Books',
  publishedYear: 1979,
  isbn: '978-0-345-39180-3',
  pages: 224,
  rating: '4.6',
  isAvailable: true,
  description: 'A comedic adventure through space.',
  coverColor: 'bg-gradient-to-br from-blue-400 to-green-400',
  borrowedBy: null,
  dueDate: null
},
{
  id: '37',
  title: 'The Giver',
  author: 'Lois Lowry',
  genre: 'Science Fiction',
  publisher: 'Houghton Mifflin',
  publishedYear: 1993,
  isbn: '978-0-547-99566-3',
  pages: 240,
  rating: '4.4',
  isAvailable: true,
  description: 'A boy discovers the dark secrets of his seemingly perfect society.',
  coverColor: 'bg-gradient-to-br from-gray-200 to-blue-200',
  borrowedBy: null,
  dueDate: null
},
{
  id: '38',
  title: 'The Maze Runner',
  author: 'James Dashner',
  genre: 'Science Fiction',
  publisher: 'Delacorte Press',
  publishedYear: 2009,
  isbn: '978-0-385-73794-5',
  pages: 374,
  rating: '4.2',
  isAvailable: false,
  description: 'Teens must escape a deadly maze.',
  coverColor: 'bg-gradient-to-br from-green-400 to-green-700',
  borrowedBy: 'Kevin Mwangi',
  dueDate: '2024-02-20'
},
{
  id: '39',
  title: 'Dune',
  author: 'Frank Herbert',
  genre: 'Science Fiction',
  publisher: 'Chilton Books',
  publishedYear: 1965,
  isbn: '978-0-441-17271-9',
  pages: 412,
  rating: '4.7',
  isAvailable: true,
  description: 'A desert planet holds the key to the universe.',
  coverColor: 'bg-gradient-to-br from-yellow-600 to-orange-800',
  borrowedBy: null,
  dueDate: null
},
{
  id: '40',
  title: 'The Stand',
  author: 'Stephen King',
  genre: 'Horror',
  publisher: 'Doubleday',
  publishedYear: 1978,
  isbn: '978-0-385-12168-3',
  pages: 823,
  rating: '4.5',
  isAvailable: true,
  description: 'A post-apocalyptic battle between good and evil.',
  coverColor: 'bg-gradient-to-br from-gray-800 to-black',
  borrowedBy: null,
  dueDate: null
},
{
  id: '41',
  title: 'The Shining Girls',
  author: 'Lauren Beukes',
  genre: 'Horror',
  publisher: 'Mulholland Books',
  publishedYear: 2013,
  isbn: '978-0-316-27848-7',
  pages: 368,
  rating: '4.0',
  isAvailable: true,
  description: 'A time-traveling serial killer and his would-be victim.',
  coverColor: 'bg-gradient-to-br from-yellow-300 to-red-400',
  borrowedBy: null,
  dueDate: null
},
{
  id: '42',
  title: 'Rebecca',
  author: 'Daphne du Maurier',
  genre: 'Mystery',
  publisher: 'Victor Gollancz',
  publishedYear: 1938,
  isbn: '978-0-06-207348-8',
  pages: 449,
  rating: '4.4',
  isAvailable: false,
  description: 'A young bride is haunted by her husband\'s first wife.',
  coverColor: 'bg-gradient-to-br from-gray-500 to-blue-900',
  borrowedBy: 'Janet Achieng',
  dueDate: '2024-02-25'
},
{
  id: '43',
  title: 'The Woman in White',
  author: 'Wilkie Collins',
  genre: 'Mystery',
  publisher: 'Samson Low, Son & Co.',
  publishedYear: 1859,
  isbn: '978-0-14-143961-7',
  pages: 672,
  rating: '4.2',
  isAvailable: true,
  description: 'A mysterious woman in white disrupts a quiet life.',
  coverColor: 'bg-gradient-to-br from-white to-gray-300',
  borrowedBy: null,
  dueDate: null
},
{
  id: '44',
  title: 'The Girl on the Train',
  author: 'Paula Hawkins',
  genre: 'Mystery',
  publisher: 'Riverhead Books',
  publishedYear: 2015,
  isbn: '978-1-59463-366-9',
  pages: 395,
  rating: '4.1',
  isAvailable: true,
  description: 'A woman becomes entangled in a missing person investigation.',
  coverColor: 'bg-gradient-to-br from-blue-700 to-black',
  borrowedBy: null,
  dueDate: null
},
{
  id: '45',
  title: 'It',
  author: 'Stephen King',
  genre: 'Horror',
  publisher: 'Viking',
  publishedYear: 1986,
  isbn: '978-0-670-81302-5',
  pages: 1138,
  rating: '4.6',
  isAvailable: false,
  description: 'A group of friends confronts an ancient evil.',
  coverColor: 'bg-gradient-to-br from-red-800 to-black',
  borrowedBy: 'Samuel Kariuki',
  dueDate: '2024-03-01'
},
{
  id: '46',
  title: 'The Time Traveler\'s Wife',
  author: 'Audrey Niffenegger',
  genre: 'Romance',
  publisher: 'MacAdam/Cage',
  publishedYear: 2003,
  isbn: '978-1-931561-52-2',
  pages: 546,
  rating: '4.3',
  isAvailable: true,
  description: 'A love story complicated by time travel.',
  coverColor: 'bg-gradient-to-br from-pink-300 to-blue-300',
  borrowedBy: null,
  dueDate: null
},
{
  id: '47',
  title: 'Twilight',
  author: 'Stephenie Meyer',
  genre: 'Romance',
  publisher: 'Little, Brown and Company',
  publishedYear: 2005,
  isbn: '978-0-316-16017-1',
  pages: 498,
  rating: '4.0',
  isAvailable: true,
  description: 'A teenage girl falls in love with a vampire.',
  coverColor: 'bg-gradient-to-br from-gray-900 to-red-900',
  borrowedBy: null,
  dueDate: null
},
{
  id: '48',
  title: 'Me Before You',
  author: 'Jojo Moyes',
  genre: 'Romance',
  publisher: 'Michael Joseph',
  publishedYear: 2012,
  isbn: '978-0-7181-9606-5',
  pages: 480,
  rating: '4.2',
  isAvailable: true,
  description: 'A woman becomes a caregiver for a paralyzed man.',
  coverColor: 'bg-gradient-to-br from-pink-200 to-yellow-200',
  borrowedBy: null,
  dueDate: null
},
{
  id: '49',
  title: 'Fifty Shades of Grey',
  author: 'E.L. James',
  genre: 'Romance',
  publisher: 'Vintage Books',
  publishedYear: 2011,
  isbn: '978-0-345-80348-1',
  pages: 514,
  rating: '3.9',
  isAvailable: false,
  description: 'A romance with a dark twist.',
  coverColor: 'bg-gradient-to-br from-gray-400 to-gray-700',
  borrowedBy: 'Lucy Wambui',
  dueDate: '2024-03-05'
},
{
  id: '50',
  title: 'Outlander',
  author: 'Diana Gabaldon',
  genre: 'Romance',
  publisher: 'Delacorte Press',
  publishedYear: 1991,
  isbn: '978-0-385-30230-5',
  pages: 850,
  rating: '4.4',
  isAvailable: true,
  description: 'A WWII nurse is transported back to 18th-century Scotland.',
  coverColor: 'bg-gradient-to-br from-blue-600 to-green-600',
  borrowedBy: null,
  dueDate: null
}
];

export default function BookCatalog() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;
  
  const router = useRouter();

  // Mock user data
  const mockUser: UserData = {
    id: '1',
    name: 'Pamela Abaki',
    email: 'pamela@maktaba.com',
    role: 'reader',
    borrowedBooks: ['2', '5', '8', '12']
  };

  // Load books
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBooks(mockBooks);
        setFilteredBooks(mockBooks);
      } catch (err) {
        setError('Failed to load books. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();
  }, []);

  // Filter and sort books
  useEffect(() => {
    let result = [...books];

    // Search filter
    if (searchTerm) {
      result = result.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Genre filter
    if (selectedGenre !== 'all') {
      result = result.filter(book => book.genre === selectedGenre);
    }

    // Availability filter
    if (availabilityFilter !== 'all') {
      const available = availabilityFilter === 'available';
      result = result.filter(book => book.isAvailable === available);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'title') {
        return sortOrder === 'asc' 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === 'author') {
        return sortOrder === 'asc'
          ? a.author.localeCompare(b.author)
          : b.author.localeCompare(a.author);
      } else if (sortBy === 'year') {
        return sortOrder === 'asc'
          ? a.publishedYear - b.publishedYear
          : b.publishedYear - a.publishedYear;
      } else if (sortBy === 'rating') {
        return sortOrder === 'asc'
          ? parseFloat(a.rating) - parseFloat(b.rating)
          : parseFloat(b.rating) - parseFloat(a.rating);
      }
      return 0;
    });

    setFilteredBooks(result);
    setCurrentPage(1);
  }, [searchTerm, selectedGenre, availabilityFilter, sortBy, sortOrder, books]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleBorrowRequest = async (bookId: string) => {
    try {
      if (mockUser.borrowedBooks.includes(bookId)) {
        alert('You have already borrowed this book.');
        return;
      }

      if (mockUser.borrowedBooks.length >= 5) {
        alert('You have reached your borrowing limit of 5 books.');
        return;
      }

      // Simulate API call
      alert(`Book requested successfully! Book ID: ${bookId}`);
      
    } catch (err) {
      alert('Failed to request book. Please try again.');
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const currentBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const genres = ['all', 'Fiction', 'Fantasy', 'Mystery', 'Science Fiction', 'Horror', 'Romance'];
  const availabilityOptions = ['all', 'available', 'unavailable'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading library catalog...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Maktaba Library Catalog</h1>
            </div>
            <div className="flex items-center gap-4">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Welcome, {mockUser.name}</span>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-white/20">
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search books by title, author, or genre..."
              value={searchTerm}
              onChange={handleSearch}
              className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg placeholder-gray-500"
            />
          </div>

          {/* Filters and Sort */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre === 'all' ? 'All Genres' : genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
              >
                {availabilityOptions.map(option => (
                  <option key={option} value={option}>
                    {option === 'all' ? 'All Books' : option === 'available' ? 'Available' : 'Unavailable'}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
              >
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="year">Year</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {currentBooks.length} of {filteredBooks.length} books
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentBooks.map(book => (
            <div key={book.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20">
              {/* Book Cover */}
              <div className={`h-48 ${book.coverColor} flex items-center justify-center relative`}>
                <BookOpen className="w-16 h-16 text-white opacity-90" />
                {!book.isAvailable && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Borrowed
                  </div>
                )}
              </div>

              {/* Book Info */}
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{book.title}</h3>
                <p className="text-gray-600 mb-3">by {book.author}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {book.genre}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{book.rating}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-4 line-clamp-3">{book.description}</p>

                {/* Book Details */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-500">
                  <div>Year: {book.publishedYear}</div>
                  <div>Pages: {book.pages}</div>
                  <div>Publisher: {book.publisher}</div>
                  <div>ISBN: {book.isbn}</div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleBorrowRequest(book.id)}
                  disabled={!book.isAvailable || mockUser.borrowedBooks.includes(book.id)}
                  className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    book.isAvailable && !mockUser.borrowedBooks.includes(book.id)
                      ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {mockUser.borrowedBooks.includes(book.id)
                    ? 'Not available'
                    : book.isAvailable
                    ? 'Borrow Book'
                    : 'Unavailable'
                  }
                </button>

                {book.dueDate && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-red-500">
                    <Clock className="w-4 h-4" />
                    <span>Due: {book.dueDate}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-xl disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-xl ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-xl disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredBooks.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedGenre('all');
                setAvailabilityFilter('all');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}