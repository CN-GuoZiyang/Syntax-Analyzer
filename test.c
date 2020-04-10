int a = 0;

int main() {
	int d = 0;
	for(a = 0; a < 10; a ++) {
		printf(a);
	}
	d = test();
	return 0;
}

int b = 12;

int test() {
	int c = b+1;
	printf(b);
	return c;
}