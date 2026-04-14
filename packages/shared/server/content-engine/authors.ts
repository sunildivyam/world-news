export const NEWS_AUTHORS = [
  "Aarav Sharma",
  "Ishani Deshmukh",
  "Arjun Iyer",
  "Ananya Chatterjee",
  "Rohan Malhotra",
  "Saanvi Reddy",
  "Kabir Gill",
  "Meera Kulkarni",
  "Aditya Verma",
  "Diya Nair",
  "Vikram Singh",
  "Zoya Khan",
  "Pranav Joshi",
  "Riya Mukherjee",
  "Siddharth Gupta",
  "Aavya Patel",
  "Ishaan Choudhury",
  "Kavya Menon",
  "Yash Bansal",
  "Anika Grewal",
];

/**
 * Returns a random string from the provided array.
 * @param names - An array of strings (e.g., Indian full names)
 * @returns A single random string from the array
 */
const getRandomName = (names: string[]): string => {
  if (names.length === 0) {
    throw new Error("The array is empty. Cannot pick a name.");
  }

  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
};

export const randomAuthor = getRandomName(NEWS_AUTHORS);
