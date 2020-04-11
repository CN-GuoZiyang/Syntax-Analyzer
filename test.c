int a = 0;
char array[12];

int test();
void test1(int a);

int main() {
	int d = 0;
	array[0] = 'a';
	for(a = 0; a < 10; a ++) {
		printf(a);
	}
	d = test();
	do {
		test1(d);
		d --;
	} while(d > 0);
	if(d == a) {
		printf(d);
	}
	return 0;
}

int b = 12;

int test() {
	int c = b+1;
	printf(b);
	return c;
}

void test1(int a) {
	printf(a);
	return;
}