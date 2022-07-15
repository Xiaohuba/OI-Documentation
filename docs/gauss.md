---
id: gauss
title: 高斯消元法
sidebar_label: 高斯消元法
---

# Perface

$\text{Gauss-Jordan}$ 消元是求解线性方程组的一般方式。


# Analysis

你：“线性方程组嘛，小学就会了好吧！这两个带佬研究这干嘛？”

例子：

$\begin{cases}2x + 3y + z= 18&\text{I}\ \\x+y+2z=15&\text{II}\\y+z=8&\text{III}\end{cases}$

请欣赏 $\text{Gauss}$ 和 $\text{Jordan}$ 是如何一般地解决这个问题的。

我们的目标：逐个消去 $x, y, z$，使方程组简单化。

将 $\text{I}$ 乘上 $-(1/2) = -\dfrac{1}{2}$，再加到 $\text{II}$ 中。

得：

$\begin{cases} -\frac{1}{2}y+\frac{3}{2}z=6&\text{II}^{'}\\y+z=8&\text{III}\end{cases}$

将 $\text{II}^{'}$ 乘上 $-[1/(-\frac{1}{2})]=2$ 再加到 $\text{III}$ 中。

得：

$4z=20$

解得 $z=5$。

回代入 $\text{II}^{'}$：

$-\frac{1}{2}y + \frac{15}{2} = 6$

解得 $y=3$

回代入 $I$：

$2x+9+5=18$

解得 $x=2$。

故此方程的解为 $\begin{cases}x=2\\y=3\\z=5\end{cases}$。

在程序中，我们该如何存储一个方程组呢？

矩阵！

自然地，一个 $n$ 元方程组可以用一个 $n \ast (n+1)$ 的矩阵来存储。

你问我最后为啥要多一列，当然是存每个方程的右边部分了。

例子中的方程就可以转换为如下矩阵：

$\begin{bmatrix}{2 \ \ 3 \ \ 1 \ \ 18 }\\{1 \ \ 1 \ \ 2 \ \ 15}\\{0 \ \ 1 \ \ 1 \ \ 8}\end{bmatrix}$。

第一次变换后：

$\begin{bmatrix}{2 \ \ 3 \ \ 1 \ \ 18 }\\{0 \ \ -\frac{1}{2} \ \ \frac{3}{2} \ \ 6}\\{0 \ \ 1 \ \ 1 \ \ 8}\end{bmatrix}$。

第二次变换：

$\begin{bmatrix}{2 \ \ 3 \ \ 1 \ \ 18 }\\{0 \ \ -\frac{1}{2} \ \ \frac{3}{2} \ \ 6}\\{0 \ \ 0 \ \ 4 \ \ 20}\end{bmatrix}$。

可见，这其实就是一个把这个矩阵变成一个上底为 $(n+1)$，下底为 $2$ 的梯形。 

总结一下过程：

我们一个个变量看，对于当前变量 $x_i$：

找出含有 $x_i$ 的，且其系数的绝对值最大的一条方程。

为了接下来的方便操作，将此方程的除以 $x_i$ 的系数。

将其余的含有 $x_i$ 的方程的 $x_i$ 系数化为 $0$，其他系数做减法即可。

（个人感觉还是按照代码好理解一些

# Achieve

```cpp
#include<bits/stdc++.h>
using db = double;

const int N = 105;
const db eps = 1e-5;

int n;
db mtx[N][N], ans[N];

int main() {
	scanf("%d",&n);
	for (int i=1; i<=n; i++) 
		for (int j=1; j<=n+1; j++)
			scanf("%lf",&mtx[i][j]);
	for (int i=1; i<=n; i++) {
		int row = i;
		for (int j=i+1; j<=n; j++) if (fabs(mtx[j][i]) > fabs(mtx[row][i])) row = j;
		if (fabs(mtx[row][i]) < eps) {
			puts("No Solution");
			exit(0);
		}//没找到，意味着它在之前就被消掉了，是“自由元”
		if (i != row) std::swap(mtx[i], mtx[row]); // 为了方便地找出其余的方程以及后面的回代
		db q = mtx[i][i];
		for (int j=i; j<=n+1; j++) mtx[i][j] /= q; //系数化1
		for (int j=i+1; j<=n; j++) {
			q = mtx[j][i]; 
			for (int k=i; k<=n+1; k++)
				mtx[j][k] -= mtx[i][k]*q;
		} // 加减消元
	}
	// 回代
	ans[n]=mtx[n][n+1];
	for (int i=n-1; i>=1; i--) {
		ans[i] = mtx[i][n+1];
		for (int j=i+1; j<=n; j++)
			ans[i] -= mtx[i][j]*ans[j]; 
		// 这个变量的答案即为：RHS - 左式已知元乘以已知元对应系数
	}
	for (int i=1; i<=n; i++) printf("%.2lf\n",ans[i]);
}
```


# Postscript

控制精度可以用手写分数类来代替 ``double``。

贴一个我的分数板子，可以参考一下实现：

[板子](https://www.luogu.com.cn/paste/8gcio57u)

（还是蛮好理解的吧qwq
