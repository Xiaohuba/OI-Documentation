---
id: crt
title: 中国剩余定理
sidebar_label: 中国剩余定理
---

# 描述


## 问题描述
回到梦开始的地方：

    有物不知其数，三三数之剩二，五五数之剩三，七七数之剩二。问物几何？

不过评测寄可读不懂古文，我们给出形式化的问题描述：

给定下列线性同余方程组：

$\begin{cases}x \equiv r_1 (\operatorname{mod} m_1)\\x \equiv r_2 (\operatorname{mod} m_2)\\\dots\\x \equiv r_n (\operatorname{mod} m_n)\end{cases}$

$m$ 两两互素。

求解 $x$。

## 定理描述
 + 令 $M = \prod\limits_{i=1}^{n}m_i,p_i=M/r_i$
 + 令 $q_i$ 表示 $p_i$ 的乘法逆元。

 + 则其通解的形式为：

 $x=\sum\limits_{i=1}^{n}p_iq_ir_i+kM,(k\in\mathbb{Z})$


# 证明

显然地，由于 $m_i$ 互素，则 $m_i$ 与 $p_i$ 互素。

这说明 $p_i$ 在模 $m_i$ 意义下乘法逆元必存在。

自然地：

$p_iq_ir_i \equiv r_i (\operatorname{mod} m_i)$

显然地：

$\forall j\in \{\mathbb{N} \cap [1,n]-i\}, p_jq_jr_j \equiv 0 (\operatorname{mod} m_i)$ 

所以 $x \equiv \sum\limits_{j\not=i}p_jq_jr_j+p_iq_ir_i \equiv \sum0+r_i\equiv r_i (\operatorname{mod} m_i)$。

故 $x$ 为一个合法解。

若另一合法解为 $x^\prime:$

$x^\prime-x\equiv0(\operatorname{mod} m_i)$

而 $m_i$ 互素，这说明 $M \mid x^\prime-x$，故方程任意两解间必相差 $M$ 的整数倍，定理得证。

当 $k=0$，$x=x_{\operatorname{min}}$。

# 代码实现

实现难度不高，要注意的是乘法逆元在不同题目中的处理方式，对于洛谷模板，我们用 $\operatorname{exgcd}$ 求解（模数互素）。

```cpp
namespace CRT {
	const int N = 10004;
	int n;
	typedef long long vType;
	vType r[N], m[N], M;
	void init(int _n, int *_r, int *_m) {
		n = _n;
		m = 1;
		for (int i=1; i<=n; i++) {
			m[i] = _m[i];
			r[i] = _r[i];
			M *= m[i];
		}
	}

	void exgcd(vType a, vType b, vType &x, vType &y) {
		if (!b) {
			x=1;y=0;
			return ;
		}
		vType xx, yy;
		exgcd(y, x%y, xx, yy);
		x = yy;
		y = xx - (a/b)*yy;
	}

	vType solve() {
		vType ans = 0;
		for (int i=1; i<=n; i++) {
			vType p=M/r[i], q, tmp;
			exgcd(p,m[i],q,tmp);
			if (q<0) q += M;
			ans = (ans + ((p*q)%M*r[i])%M)%M;
		}
		ans %= M;
		if (ans < 0) ans += M;
		return ans;
	}
}
```

~~本来想在 exgcd 那里夹带私货的~~

# 后记

上次在知乎上看到了一篇优美的抽象代数证明，不过菜狗不会，有机会再补。
