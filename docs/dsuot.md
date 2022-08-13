---
title: 树上启发式合并(a.k.a DSU on tree)学习笔记
sidebar_label: 树上启发式合并学习笔记
id: dsuot
---

## 1. Perface

> ~~可爱的~~ lls 抛给你一个问题：[CF600E](https://www.luogu.com.cn/problem/CF600E)

当然，我们可以写出漂亮的 $O(N^2)$ 解法。

问题是，不会 TLE 吗（

## 2. Analysis
我们考虑如何高效复用已经算过的数据。

可以发现，每次遍历子树，最后一棵计算的子树是可以保留的。

于是，我们考虑让这颗子树尽可能大。

我们定义 $son_i$ 为 $i$ 节点的**重儿子**，即最大的那一棵子树的根结点。~~没错就是树剖的重儿子~~

显然，任何叶子结点的重儿子为空。（在实现时，一般设置它为0）。

我们可以通过一次 dfs 来求解重儿子。
```cpp
int sz[MAXN],son[MAXN];
// sz[i] 表示 以 i 为根的子树的大小
void dfs1(int x, int fa)
{
	sz[x]=1,son[x]=0;
	for(int v:T[x])
	{
		if(v==fa) continue;
		dfs1(v,x);
		sz[x]+=sz[v];
		// cerr<<sz[v]<<' '<<sz[0]<<endl;
		if(sz[v]>sz[son[x]]) son[x]=v;
	}
}
```
接下来我们可以通过一次 dfs 来完成 $\mathtt{DSU\ on\ Tree}$。
```cpp
// dsu on tree 主体部分算法框架
int c[MAXN],Q[MAXN],top=0,cnt[MAXN],Ans[MAXN],cur=0,maxv=0；
// 分别为：每个节点颜色，贡献栈及栈顶，每种颜色的数量，最终答案，当前答案
void dfs2(int x, int fa)
{
	for(int v:T[x]) if(v!=fa && v!=son[x]) dfs2(v,x),erase(); // 不是重儿子，用完即清空
	if(son[x]) dfs2(son[x],x); // 重儿子，保留
	for(int v:T[x]) if(v!=fa && v!=son[x]) insertSubTree(v,x); // 重新加入非重儿子的贡献
	insert(x); // 加入根结点
	Ans[x]=cur; // 计算
}
```

我们发现，接下来要实现的就是 3 个函数：```erase```，```insert```，```insertSubTree```。

**清空函数实现**

这个简单，把贡献栈弹空就行了！
```cpp
il void erase()
{
	while(top)
		cnt[Q[top--]]=0;
	cur=maxv=0;
}
```
~~不要 memset(0)，会出事的~~

**加入单点实现**

```cpp
il void insert(int x)
{
	cnt[(Q[++top]=c[x])]++; // 加入贡献栈并更新计数
	if(cnt[c[x]]>maxv) maxv=cnt[c[x]],cur=c[x]; 
	else if(cnt[c[x]]==maxv) cur+=c[x];
    // 更新答案
}
```

**加入子树实现**

很显然，用```insert```加入根结点，再递归往下加就行了。
```cpp
il void insertSubTree(int rt, int fa)
{
	insert(rt);
	for(int v:T[rt])
	{
		if(v==fa) continue;
		insertSubTree(v,rt);
	}
}
```

**时间复杂度分析**

~~类似于树剖，咕咕咕~~

时间复杂度为 $O(n \log n)$。

## 3. Practice

[这里](https://www.luogu.com.cn/problem/list?type=CF&page=1&tag=55)有一个题单。

其实很多线段树合并的题都可以离线有树上启发式合并做，好理解又不容易挂（