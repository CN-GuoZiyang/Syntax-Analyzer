int a = 0;
char array[12];

int test();
void test1(int a);

struct abc {
	int a;
	char b;
	long c;
};

int main() {
	int d = 0;
	struct abc d;
	array[0] = 'a';
	d.a = 10;
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

struct abcd {
	int a;
	char b;
	long c[12];
};

void test1(int a) {
	struct abcd t;
	t.b = '\n';
	printf(a);
	return;
}