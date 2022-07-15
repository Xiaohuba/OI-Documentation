---
id: multiplicative_inverse
title: 乘法逆元
sidebar_label: 乘法逆元
---

# 逆元的定义

Xiaohuba 的温馨提示：不想看这部分群论上逆元的定义的读者，可直接阅读下一章。

看到这个标题时，我们不妨将目光放得更为长远些，何为逆元？

它的定义要从“群”说起。

群是啥？

~~qq群，微信群，钉钉群……~~

## 群的构成

一个群 ( $\operatorname{group}$ ) 由两部分组成：一种二元运算符 ( $\operatorname{binary \ operator}$ )，一般记作 "$\cdot$"；以及一个集合 $G$。

## 群的幺元
群 $(G, \cdot)$ 的幺元 $\mathbf{e}$ 定义为：若存在 $\mathbf{e} \in G$ 使得 $\forall a \in G,a \cdot  \mathbf{e}=a$ 成立，则称 $\mathbf{e}$ 是此群的幺元，
$\mathbf{e}$ 有且仅有一个。

例子：正整数加法群 $(\mathbb{Z}^{+},+)$ 的幺元 $\mathbf{e} = 0,(0+1=1,0+666=666 \cdots)$ 

## 群的逆元

群 $(G,\cdot)$ 的逆元定义为：$\forall a \in G$，总存在 $b$  使得 $a\cdot b=b \cdot a=\mathbf{e}$，则 $b$ 是 $a$ 的逆元，记作 $a^{-1}$。

# 乘法逆元

## 定义

根据上面的定义，乘法逆元的定义也不难得到：

带模乘法群 $(\mathbb{Z},(\times,\operatorname{mod}))$ 的逆元定义为：对于 $a \in \mathbb{Z}$，若存在 $b$ 使得 $ab \equiv 1(\operatorname{mod} m)$，则称 $b$ 是在模 $m$ 意义下 $a$ 的逆元。

不基于群论的定义：若存在 $b$ 使得 $ab \equiv 1 (\operatorname{mod} m)$，则称 $b$ 是 $a$ 在模 $m$ 意义下的乘法逆元。

## 应用

最直接的应用：解决了除法取模的问题，即 $\dfrac{p}{q} \equiv pq^{-1} (\operatorname{mod} m)$


## exgcd 求解 

$ab \equiv 1 (\operatorname{mod} m)$

$ab = mq+1 (q \in \mathbb{Z})$

$ab-mq=1$

当 $\gcd(a,m) =1$ 时，此方程为 $ax+by=\gcd(x, y)$ 的形式，可以用 $\operatorname{exgcd}$ 求解。

## 费马小定理求解

考虑费马小定理：对于任意素数 $p$，对于所有与 $p$ 互素的数 $a$ 有 $a^p \equiv p (\operatorname{mod} p)$

即 $a^{p-1} \equiv 1 (\operatorname{mod} p)$

$a*a^{p-2} \equiv 1(\operatorname{mod} p)$

所以当 $m$ 为素数时，$b = a^{m-2} \operatorname{mod} m$

使用带模快速幂求解即可。

## 逆元的递推柿

尝试通过递推来求出 $[1,n] \cap \mathbb{N}$ 中所有数在模 $m$ 意义下的乘法逆元。

不妨令 $iv_i$ 表示 $i$ 在模 $m$ 意义下的逆元。

特别地，$iv_1=1$

考虑如何求出 $iv_x$。

设 $q=\left\lfloor{\dfrac{m}{x}}\right\rfloor, r=m \operatorname{mod} x$。

$xq+r \equiv 0 (\operatorname{mod} m)$

同时乘以 $x^{-1} * r^{-1}$

$r^{-1}q + x^{-1} \equiv 0 (\operatorname{mod} m)$

$x^{-1} \equiv -r^{-1}q (\operatorname{mod} m)$

$x^{-1} \equiv (-\left\lfloor{\dfrac{m}{x}}\right\rfloor ({m \operatorname{mod} x})^{-1}) \operatorname{mod} p$ 

为了避免负数取模的锅，我们得到递推式如下：

$iv_i = (m - \left\lfloor{\dfrac{m}{i}}\right\rfloor)*iv_{m \operatorname{mod} i} \operatorname{mod} m$

这个柿子在求解组合数时较为常用。
