# 莫队

## 1. 普通莫队

> 前置芝士：分块

在做题时，你有没有碰到过这样一类题：

- 判断区间内有多少个不同的数字
- 维护区间各个数字个数

~~你当然可以写树套树~~，但是莫队可能是一种更好的选择。

### 1.1 Analytic

先讲不带修改的莫队。

放[一道例题](https://www.luogu.com.cn/problem/P2709)。

首先考虑**暴力**。

维护两个指针 l 和 r，初始情况下 l=1，r=0。

在每次询问时，把 l 挪动到 ql，把 r 挪动到 qr。

单次挪动时维护 cnt 数组，即数字出现次数。

这样单次跳是 O(1) 的，但是询问多了就会爆炸。

考虑**离线询问**。

我们可以想到 sort 一下询问，防止莫队反复横跳。

问题是怎么 sort 呢？

> 如果按 ql 排序，那么 qr 可以反复横跳；
>
> 如果按 qr 排序，那么 ql 也就……

于是，伟大的国家队教练想了一个方法——按分块思想排序！

具体来说，按找 ql 所在块的编号排序，如果相同再按 qr 所在块的编号排序。

这样就可以有效避免复杂度退化了！

和分块一样，一般设块长为 ```sqrt(n)```。

### 1.2 Code

具体代码实现过程中，我们一般采用如下的结构：

```cpp
ll n,m,k;
ll a[50001];
ll block;
struct Query
{
	int l,r,id;//id是原来询问的编号
	bool operator< (const Query & rhs) const
	{
		return l/block==rhs.l/block ? r<rhs.r : l<rhs.l;//离线排序
	}
}q[50001];//询问
ll cnt[50001];
ll res[50001];

void del(int pos){}//删除pos位置上的数
void add(int pos){}//加入pos位置上的数

signed main()
{
	read(n,m,k);
	block=sqrt(n);
	For(i,1,n) read(a[i]);
	For(i,1,m)
	{
		read(q[i].l,q[i].r);
		q[i].id=i;
	}
	sort(q+1,q+1+m);//排序以离线
	int xl=1,xr=0;//两个指针
	For(i,1,m)
	{
		while(xl<q[i].l) del(xl),xl++;//左指针->
		while(xl>q[i].l) xl--,add(xl);//<-左指针
		while(xr<q[i].r) xr++,add(xr);//右指针->
		while(xr>q[i].r) del(xr),xr--;//<-右指针
		res[q[i].id]=ans;//储存答案
	}
	For(i,1,m) write_with_endl(res[i]);
	return 0;
}
```



[例题代码](https://www.luogu.com.cn/paste/4sytqmq3)

### 2. 带修莫队

本质上就是普通莫队多了一维时间维，可以在时间维上跳来跳去。

实现方面，多了一个 Edit 结构体表示修改操作。

另外块长一般取 c++ 中的 ```pow(n,0.6666667)```。

[板子](https://www.luogu.com.cn/problem/P1903) 和 [代码](https://www.luogu.com.cn/paste/nx8q3p07)。

