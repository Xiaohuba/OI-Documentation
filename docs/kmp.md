---
id: kmp
title: KMP
sidebar_label: KMP
---
### 1.1 前言
kmp，是一种用于字符串匹配的线性算法，复杂度 $O(n+m)$，其中 $n$ 为文本串，$m$ 为模式串。

> 名字来源：_**K**nuth(D.E.Knuth) & **M**orris(J.H.Morris) & **P**ratt(V.R.Pratt)_

### 1.2 引入
我们知道，朴素的字符串匹配是 $O(nm)$ 的。

我们使用两个指针 $i$ 和 $j$，并逐位比对。（$a$ 为文本串，$b$ 为模式串）

```cpp
For(i,1,la)
{
	bool flg=1;
	For(j,1,lb)
    {
    	if(a[i+j-1] != b[j])
        {
        	flg=0;
            break;
        }
    }
    if(flg)
    	cout<<i<<endl;
}
```
那么，怎么优化呢？
### 1.3 优化
我们知道，对于 $i$ 指针，最好的情况就是单调不减；但是对于 $j$，我们可以想办法让他在「失配」后尽可能少往前移动。

> **概念：$border$**

> 定义一个字符串 $s$ 的 $border$ 为 $s$ 的一个非 $s$ 本身的子串 $t$，满足 $t$ 既是 $s$ 的前缀，又是 $s$ 的后缀。

所以我们引入一个 $p$ 数组：

> $p_i$ 表示 $a$ 的前缀 $a[1...i]$ 中，最长的 $border$ 的长度。

求法如下：（思想是「用自己匹配自己」）
![](https://cdn.luogu.com.cn/upload/image_hosting/6aopigjp.png)

```cpp
For(i,2,len_b) // p[1] 一定等于 0，故不用求
{
	while(j && b[j+1] != b[i]) j=b[j]; // 失配，往回跳
    if(b[j+1]==b[i])
    	++j;
    p[i]=j;
}
```
![kmp2](/kmp2.gif)
有了 $p$ 数组，我们就可以快捷地**利用以求过的信息，快速完成计算啦**！

> 假设在匹配 $b_j$ 和 $a_i$ 时失配，我们只要将 $j\leftarrow p[j],\ i\leftarrow i+1$ 之后继续进行计算即可！

```cpp
For(i,1,len_a)
{
	while(j && b[j+1] != a[i]) j=b[j];
    if(b[j+1]==a[i]) ++j;
    if(j==len_b)
    {
    	cout<<i-j+1<<endl; // 匹配成功
        j=b[j];
    }
}
```
![kmp1](/kmp1.gif)