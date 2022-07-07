# 0. 简介
树状数组，又名 fenwick tree ，有时简称为 FT 或 BIT 是一种基于二进制分解的数据结构，可以认为是线段树**某些**功能的小码量&小常数代替品。

它只能求某个信息的前缀，并且**不能以易懂的方式**同时维护区间求和，区间查询。

# 1.原理

## 1. 拆区间


> 本质上是一种基于二进制的分块！

时间复杂度是O(1)~O(log n)级别的，空间是O(n)。

## 2.性质

令树状数组为 $ft$ 。

则有如下性质：
+ $ft(i)$ 保存区间 $[i-lowbit(i)+1,i]$ 的信息。

+ $ft(i)$ 的父节点是 $ft(i+lowbit(i))$ 。

+ $ft(i)$ 的儿子个数是 $lowbit(i)$ 的位数。

# 2.实现

## 1.操作需求

[传送门](https://www.luogu.com.cn/problem/P3374)

给定数列 $a$ ，有两种操作：

+ 求出 [L,R] 之和 。

+ 将 $a_x$ 加上 $y$ 。

## 2. 实现
对于求和，我们利用拆区间技巧求出 $L,R$ 的前缀和，再相减即可。

对于修改，我们先直接修改 $ft(i)$ 再利用性质2修改它所有祖先的值即可。

~~都很好理解吧~~

但还有一个东西我们忘了：

	预处理

下文介绍 $\Theta(N)$ 的做法。

每当输入 $a_i$ ,先将 $ft(i)$ **加**上 $a_i$，再将他的父亲加上 $ft(i)$，这样，它后面出现的祖先就会加上已经被修改过的已经出现的级别更低的祖先，这样就保证了正确性。

## 3.代码

```cpp
#include<bits/stdc++.h>

using namespace std;

const int mxN=5e5+5;
int n,m,ft[mxN];

void mdf(int i,int k){for(; i<=n /*不能跳出去*/; i += i & -i/*往父亲跳*/) ft[i]+=k; }
int qry(int i){int r=0;for(; i /*不能跳出去*/; i -= i & -i/*往更小的区间（儿子）跳*/) r+=ft[i]; return r;}

int main()
{
   	/***SJX YYDS***/ 
   	
   	cin>> n >> m ;
   	for(int i=1,x;i<=n;i++)
	{
		scanf("%d",&x);
		ft[i] += x;
		int p = i + (i & -i) ;
		if(p <= n) ft[p]+=ft[i];
		/*见对预处理的分析*/ 
	} 
	int op,qa,qb;
	while(m--)
	{
		scanf("%d%d%d",&op,&qa,&qb);
		if(op==1) mdf(qa,qb); 
		else printf("%d\n",qry(qb) - qry(qa-1));//前缀和思想 
	}
    return 0;
}

```