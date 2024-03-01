import { promises as fsProm } from "fs";

async function makeFiles() {
  try {
    const data = await fsProm.readFile("instrukce.txt");
    const fileData = parseInt(data, 10);

    for (let i = 0; i < fileData; i++) {
      await fsProm.writeFile(i.toString() + ".txt", "Soubor " + i.toString());
    }
    console.log("All files were created successfully");
  } catch (err) {
    console.error(err);
  }
}

makeFiles();
