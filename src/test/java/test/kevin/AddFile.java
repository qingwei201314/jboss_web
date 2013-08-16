package test.kevin;

import java.io.File;
import java.io.IOException;

public class AddFile {
	public static void main(String[] args) throws IOException {
		for (int i = 0; i < 10000; i++) {
			File file = new File("C:/logs2/submit" + i);
			file.mkdirs();
		}
		System.out.println("Congratulations");
	}
}
