# 线段树
## 1.引入 
现在 lls抛给你一个问题：输入一个数列 需支持在线询问区间l - r的和。

显然这题可以用~~可爱的~~前缀和O(1)解决。

那lls加强题目：还要支持对第x个数加上一个数K，怎么办？

~~拜拜了您内我不做了~~

我们考虑对前缀和数组修改 但这样的复杂度将变成O(n)。 这种辣鸡复杂度能过的题就不叫数据结构题了

这时，我们就请出了它 -- 线段树

## 2.介绍
线段树是一种非常强大的树形数据结构，它可以维护各种~~乱七八糟的~~区间信息，它可以在O(logn)的时间复杂度内完成对一个线性序列的大部分操作，但前提是维护信息必须满足结合律。
线段树的每个节点都要保存一个区间的信息。
## 3.无区间修改的线段树实现
### 3.0 例题 
[我是例题](https://www.luogu.com.cn/problem/P3374)
### 3.1 存储与建树
#### 3.1.1 分析
令当前节点编号为p 保存区间的左右边界分别为l,r
 而对于一颗二叉树 我们还要知道它的左孩子和右孩子，我们采取堆式存储法：
 则左节点为px2  右节点为px2+1（我一般提前define掉）


我们想知道一个区间的信息 可以利用分治思想 把它变成左右两部份 令mid=(l+r)/2      
则左节点为保存区间的左右边界为(l,mid)

 右节点为保存区间的左右边界为(mid+1,r)	

 那么对于信息的向上维护（从左右孩子推出父节点信息）也变得非常简单 只需对题目具体分析 然后利用结合律按题目意思模拟即可

 这里再放张图照顾一下对式子过敏的同学：


 ![我是图片](https://cdn.luogu.com.cn/upload/image_hosting/h43wvhgo.png?x-oss-process=image/resize,m_lfit,h_170,w_225)

 #### 3.1.2 代码实现
 那么我们用结构体存储每个节点，再利用分治递归建树即可，不过结构体的数组一定要开四倍序列空间。

 是不是很简单呢？ 上代码！


 ```cpp
#define lc p<<1//左孩子 
#define rc p<<1|1//右孩子 
struct Point/*线段树节点 */{
	int l,r,v;
}tree[N<<2];
void pushUp(int p)//向上维护
{
	tree[p].v=tree[lc].v+tree[rc].v;//本题要求区间和	
} 
void build(int p,int l,int r)//建树
{
	tree[p].l=l;tree[p].r=r;
	if(l==r)//若递归到叶节点 那么它的区间和退化成了原数组中的一个元素	
	{
		tree[p].v=a[l];
		return ; 
	}
	int mid=(l+r)>>1;
	build(lc,l,mid);
	build(rc,mid+1,r);
	pushUp(p);
	//这几行参考前面的分析 
} 
 ```

现在你已经掌握了线段树的存储与建树！Orz



### 3.2线段树的单点修改与区间查询
#### 3.2.1 单点修改
##### 3.2.1.1 分析
对于单点修改，我们只需要在线段树上不断查找，直到找到一个叶节点保存的点恰等于需要修改的点，将它直接修改，并回溯，在回溯时向上维护即可。
##### 3.2.1.2 代码
```cpp
void modify(int p,int x,int k)//单点修改，当前节点编号为p ，需要修改的点是序列中的第x个，需要将它加上k
{
	if(tree[p].l==tree[p].r&&tree[p].l==x)
	{
		tree[p].v+=k;
		return ;	
	}//参考分析	
	if(x<=tree[lc].r/*也就是x<=mid*/) modify(lc,l,r);
	if(x>tree[lc].r/*也就是x>mid*/) modify(rc,l,r);
	//上面两行决定了要修改的数在当前节点的左子树还是右子树
	//这两个if建议背下来,在草稿纸上模拟一下就知道了
	pushUp(p);//修改完要记得向上维护 
} 
```
#### 3.2.2 区间查询
##### 3.2.2.1 分析
对于区间查询 我们只需在线段树上不断查找，若当前节点保存的区间包含在需查询的区间里
直接返回这个区间的值，否则就判断所查询区间是否与左子树区间有交集还是与右子树区间有交集（也有可能被同时包含了一部分）递归求有交集的几个部分的答案，将答案合并再返回即可。
##### 3.2.2.2 代码
```cpp
int query(int p,int l,int r)//区间查询 当前节点编号为p 要查询的区间为[l,r] 
{
	if(tree[p].l>=l&&r>=tree[p].r) return tree[p].v;
	int tmp=0;
	if(l<=tree[lc].r/*即l<=mid*/) tmp+=query(lc,l,r);
	if(r>tree[lc].r/*即r>mid*/)	tmp+=query(rc,l,r); 
	return tmp;
}//参考分析理解代码 
```
到这里，你已经实现了一颗难度较低的无区间操作线段树，赶紧拿它去切题吧！！

不过这只是线段树最简单的一部分，与树状数组的功能相当，接下来，更强大的，无法被树状数组取代的线段树要来了！


## 4.带区间操作的线段树
### 4.0 前言
这个部分的难度将有一个阶梯式上升，请反复阅读，保证对其理解透彻。
例题：[我是例题](https://www.luogu.com.cn/problem/P3372)
### 4.1 懒标记
#### 4.1.1 引入
看到例题，它有一个操作令我们无从下手：将区间l - r加上k

于是你想：那么能不能用一个标记代替一个区间呢？

能！

不过我们要对它的定义稍作修改---
#### 4.1.2 实现
每个节点的懒标记tag 表示这个节点所代表的区间还剩多少没有加。

这样一来 我们就只要修改tag 并在要对下一个区间做操作之前将下一个区间的值用tag修改并将它的tag也修改即可

这样，即不会影响正确性，也不会影响时间复杂度

所以我们要写的是三个操作：

PushDown : 下传标记

Modify:区间修改

Query:区间查询

（由于文字还是比较抽象，可参考代码理解）

代码环节！

```cpp
void pushDown(int p)
{	
	tree[lc].v+=(tree[lc].r-tree[lc].l+1)*tree[p].tag;
	tree[rc].v+=(tree[rc].r-tree[rc].l+1)*tree[p].tag;
	tree[lc].tag+=tree[p].tag;
	tree[rc].tag+=tree[p].tag;
	//自行根据懒标记定义理解 
	tree[p].tag=0;
 } 
void modify(int p,int l,int r,int k)//区间加法 
{
	if(tree[p].l>=l&&tree[p].r<=r)
	{
		tree[p].v+=k*(tree[p].r-tree[p].l+1);
		tree[p].tag+=k;
		return ; 
	}//若被修改区间完全包含，则直接修改 
	pushDown(p);//在递归之前下传下一层标记 
	if(l<=tree[lc].r) modify(lc,l,r,k);
	if(r>tree) modify(rc,l,r,k);
	pushUp(p);//别忘了向上维护 
} 
int query(int p,int l,int r)//区间查询 当前节点编号为p 要查询的区间为[l,r] 
{
	if(tree[p].l>=l&&r>=tree[p].r) return tree[p].v;
	int tmp=0;
	pushDown(p);//在递归之前下传下一层标记 
	if(l<=tree[lc].r/*即l<=mid*/) tmp+=query(lc,l,r);
	if(r>tree[lc].r/*即r>mid*/)	tmp+=query(rc,l,r); 
	return tmp;
}//参考分析理解代码 
```
注:spoon也是一觉醒来才对懒标记恍然大悟的，只需多思考，就能理解它


到这里：你掌握了基本的线段树功能，在做一些题时你也能灵活运用线段树，但还有许多更高深莫测的线段树算法等着你学习……


## 5.线段树的经典应用
### 5.1 逆序对计数 
#### 5.1.0 前言 
[题目传送门](https://www.luogu.com.cn/problem/P1908)  在我们刚学 OI 时就遇见过这个问题，它的时间复杂度要求是$O(n \log n)$ ，那时，我们利用归并排序的特性轻易地解决了了它，但由于归并排序的应用范围过于狭隘，现在，利用线段树来解决它反而成了对于每个看到这里的 OIer 最自然的想法。

#### 5.1.1 分析 
这个思路乍一看很难，但只要认真思考，对上文的理解深刻，还是能够自己想出来的。  

我们先思考逆序对的形成缘由，**有一个比你大的数比你先出现，那么你和他构成了一个逆序对，对于每个数，我们只要求出当前已经出现的数里有几个比他大即可**。  

反复阅读这句话，你想到了什么？  

> 桶。~~（意识流做题）~~

桶这个东西可以将大小关系转化成位置关系，这样一来，值为 val 的元素出现时，他对答案的贡献就是他后面所有桶里的数字之和。 

看到这里有个区间求和。  

> 线段树。  

~~这时你说：“这道题 ai 最多有 10^9 ，内存直接炸飞啊”~~  

看到重点部分的这个字眼“比我大”，想到了什么？  

> 离散化。  

而对于每个数的出现，只需要在桶中对应点加 1 即可。  

综上，我们只需要写一颗支持单点修改和区间查询的线段树即可。 

~~你要写树状数组我也不拦着你~~  

#### 5.1.2 代码：
```cpp
#include<bits/stdc++.h>
const int N=5e5+5;
#define lc p<<1
#define rc p<<1|1
#define ll long long 
ll ans;
struct disc{
	int val,id;
	bool operator <(const disc rhs)const
	{
		return this->val<rhs.val;
	}
}a[N];//离散化 
int n,b[N];
struct point{
	int l,r;
	ll v;
}tree[N<<2];
void pushUp(int p)
{
	tree[p].v=tree[lc].v+tree[rc].v;
}
void build(int p,int l,int r)
{
	tree[p].l=l,tree[p].r=r,tree[p].v=0;
	if(l==r)return ;//最开始没有数出现，建的是空树。 
	int mid=(l+r)>>1;
	build(lc,l,mid);
	build(rc,mid+1,r);
	pushUp(p); 
}
void modify(int p,int k)
{
	if(tree[p].l==k&&tree[p].r==k)
	{
		++tree[p].v;
		return ;
	}
	if(tree[lc].r>=k) modify(lc,k);
	if(tree[rc].l<=k) modify(rc,k);
	pushUp(p);
}//简单的单点修改 
ll query(int p,int l,int r) 
{
	if(tree[p].l>r)return 0;
	if(tree[p].r<l)return 0;
	if(tree[p].l>=l&&tree[p].r<=r)return tree[p].v;
	ll Tmp=0;
	if(l<=tree[lc].r)Tmp+=query(lc,l,r); 
	if(r>tree[lc].r)Tmp+=query(rc,l,r);
	return Tmp;
}//简单的区间查询 
int main()
{
	scanf("%d",&n);
	for(int i=1;i<=n;i++)
	{
		scanf("%d",&a[i].val);
		a[i].id=i;
	}
	std::sort(a+1,a+n+1);
	int rank=0;a[0].val=1e9+1;
	for(int i=1;i<=n;i++)b[a[i].id]=(rank+=(a[i].val!=a[i-1].val));//离散化 当然你也可以用STL三连 
	build(1,1,n);
	for(int i=1;i<=n;i++)
	{
		modify(1,b[i]);
		ans+=query(1,b[i]+1,rank);	
	}//参考分析食用 
	printf("%lld",ans);
	return 0;
}
```
#### 5.1.2 后记 
当然，这种用线段树维护桶的想法也叫权值线段树，我一般叫它树桶，它是一种非常灵活的思想，因为他可以做到删点和加点，你可以用它 AC 普通平衡树模板。

~~不过在这题里面因为离散化跑得比归并慢……~~
### 5.2 扫描线
#### 5.2.0 前言
扫描线是一种高效的求解矩形面积/周长并的算法，可以利用线段树来提速。

具体地说，就是用线段树上的一个节点对应一段线段，并将矩形分割求解。
#### 5.2.1 分析
~~咕咕咕~~
#### 5.2.2 代码
```cpp
/*
* @ Author: Xiaohuba
* @ Usage: Luogu Problem
* @ Language: C++
*/
#include<bits/stdc++.h>
using namespace std;

/* ---File Head Begin--- */
namespace Xiaohuba_File_Head
{
//def
#define ll long long
#define lll __int128
#define pii pair<int,int>
#define mkp make_pair
#define vi vector<int>
#define vs vector<string>
#define viit vector<int>::iterator
#define pb push_back
#define il inline 
#define pch putchar
#define gch getchar
#define Endl putchar('\n')
#define Space putchar(' ')
#define For(x,st,ed) for(int x=st,END=ed;x<=END;++x)
#define ForDown(x,st,ed) for(int x=st,END=ed;x>=END;--x)
#define sq(x) (x*x)
#define Set(a,b) memset(a,b,sizeof(a))
#define Cpy(a,b) memcpy(a,b,sizeof(a))
#define MOD 100000007ll
//io
template <typename T>
il void read(T & tmp){ tmp=0;char c=getchar();bool flg=0;while(!isdigit(c)) flg=c=='-',c=getchar();while(isdigit(c)) tmp=(tmp<<3)+(tmp<<1)+c-'0',c=getchar();if(flg) tmp*=-1; }
template <typename T, typename... Args>
il void read(T &tmp, Args &...tmps){ read(tmp);read(tmps...); }
template <typename T>
il void __write(const T &x){ if(x==0) return;__write(x/10);putchar(x%10+'0'); }
template <typename T>
il void write(const T &x){ if(x==0) putchar('0');if(x<0) putchar('-');__write((x<0 ? -x : x)); }
template <typename T>
il void write_with_space(const T &x){ write(x);Space; }
template <typename T>
il void write_with_endl(const T &x){ write(x);Endl; }
template <typename T, typename... Args>
il void write(const T &x, const Args &...y){ write_with_space(x);write_with_space(y...); }
il void __getline(istream & istr, string & str){ getline(istr,str);if(*(str.end()-1)=='\r') str.erase(str.end()-1); } 
#define getline __getline
};
using namespace Xiaohuba_File_Head;
/* ---File Head End--- */

/* ---Pbds Operations Begin--- */
#ifdef ONLINE_JUDGE
#include<bits/extc++.h>
using namespace __gnu_pbds;
using namespace __gnu_cxx;
namespace Xiaohuba_Pbds
{
#define Hash gp_hash_table
#define Rbt tree<pii,null_type,less<pii>,rb_tree_tag,tree_order_statistics_node_update>
#define Rank(tr,k) tr.order_of_key(pii(k,0)+1)
#define Kth(tr,k) tr.find_by_order(k-1)->first
#define Pre(tr,k) tr.find_by_order(tr.order_of_key(pii(k,0))-1)->first
#define Nxt(tr,k) tr.find_by_order(tr.order_of_key(pii(k,cnt[k]-1))+(tr.find(pii(k,0))==tr.end() ? 0 : 1))->first
#define Trie trie<string,null_type,trie_string_access_traits<>,pat_trie_tag,trie_prefix_search_node_update>
#define ForT(tr,it) pair<Trie::iterator,Trie::iterator> range=tr.prefix_range(x);for(Trie::iterator it=range.first; it!=range.second; ++it)
#define PQueue priority_queue<int,greater<int>,pairing_heap_tag>
};
using namespace Xiaohuba_Pbds;
#endif
/* ---Pbds Operations End--- */

int n;
struct Line
{
	int x1,x2,y;
	int val;
	bool operator< (const Line & rhs) const
	{
		return y<rhs.y || y==rhs.y && val<rhs.val;
	}
}a[300001];
int b[300001];
int cnt=0;

struct Node
{
	int cnt,l,r;
	ll val;
}tr[300001<<2];

void build(int p, int l, int r)
{
	tr[p].l=l,tr[p].r=r;
	if(l==r) return;
	int mid=(l+r)>>1;
	build(p<<1,l,mid);
	build((p<<1)+1,mid+1,r);
}

void push_up(int p)
{
	if(tr[p].cnt)
		tr[p].val=b[tr[p].r+1]-b[tr[p].l];
	else
		tr[p].val=tr[p<<1].val+tr[(p<<1)+1].val;
}

void add(int p, int L, int R, int k)
{
	int l=tr[p].l,r=tr[p].r;
	if(b[l]>=R || b[r+1]<=L) return;
	//cout<<l<<' '<<r<<endl;
	if(L<=b[l] && R>=b[r+1])
	{
		tr[p].cnt+=k;
		push_up(p);
		return;
	}
	add(p<<1,L,R,k);
	add((p<<1)+1,L,R,k);
	push_up(p);
}

signed main()
{
	read(n);
	For(i,1,n)
	{
		int _a,_b,_c,_d;
		read(_a,_b,_c,_d);
		a[++cnt]=(Line){_a,_c,_b,1};
		b[cnt]=_a;
		a[++cnt]=(Line){_a,_c,_d,-1};
		b[cnt]=_c;
	}
	sort(a+1,a+1+cnt);
	sort(b+1,b+1+cnt);
	int tot=unique(b+1,b+1+cnt)-(b+1);
	//cout<<tot<<endl;
	build(1,1,tot-1);
	ll ans=0;
	For(i,1,cnt-1)
	{
		add(1,a[i].x1,a[i].x2,a[i].val);
		ans+=tr[1].val*(a[i+1].y-a[i].y);
		//cout<<tr[1].val<<' '<<a[i+1].y-a[i].y<<endl;
	}
	write(ans);
	return 0;
}
```
## 6 主席树
### 6.0 前言 

主席树，这个东西听起来高大上，其实就是一种奇技淫巧，把内存节省到能过题。 

在阅览本文章之前，确保您掌握了普通线段树，否则建议学习[这篇博客](https://www.luogu.com.cn/blog/shaojunxi/spoonjunxi-sgt-post)。（~~厚颜无耻~~） 
### 6.1 基本操作的实现 
[板子](https://www.luogu.com.cn/problem/P3919) 主席树与线段树真的大差不差，除了以下几点。 
#### 6.1.1 分析

这题我们要对每个版本建一颗线段树，但内存会爆，考虑利用主席树。

#### 6.1.2 建树

令 rot_i 表示第 i 个版本的数组所构建的线段树的根节点。

注意，这里不能用堆式存储法，而是利用指针存储法来保存左右孩子。

建树代码可以说有手就行吧。

```cpp
void build(int & p,int l,int r)//p为版本号 
{
	p=++tot;//tot 表示当前有几个版本 
	tree[p].l=l;tree[p].r=r;
	if(l==r)
	{
		tree[p].val=a[l];
		return ;
	}
	int mid=(l+r)>>1;
	build(tree[p].lc,l,mid);
	build(tree[p].rc,mid+1,r);
}
```
#### 6.1.2 修改

我们可以向以其为修改基础的版本子树借用节点，以此节省空间。

```cpp
void modify(int & p,int pre,int loc,int val)//当前生成版本p 在版本pre的基础上修改
{
	p=++tot;tree[p]=tree[pre];//先继承，再修改
	if(tree[p].l==tree[p].r)
	{
		tree[p].val=val;
		return ;
	} 
	int mid=(tree[p].l+tree[p].r)>>1;
	if(loc<=mid) modify(tree[p].lc,tree[pre].lc,loc,val);
	else modify(tree[p].rc,tree[pre].rc,loc,val);
}
```
#### 6.1.3 查询

没什么好讲，直接找到对应版本号的子树上按线段树的查询方式查询好了。

### 6.2 区间 $K$ 最值

[板子](https://www.luogu.com.cn/problem/P3834)

#### 6.2.1 分析
如果，现在给你的是一颗权值线段树保存了整个数组，你会求全局 $K$ 值吗

	> 会！
那我们是否可以利用前缀和思想，对于 $rot_i$ 它指向一颗段树保存了区间 $[1,i]$ 中的信息的权值线段树的根，查询区间L,R就拿 tree_R-tree_L-1 ？

	> 是的！


​    
最后，开权值线段树记得离散化。


#### 6.2.2 代码


```cpp
/*--code by Spoon--*/
#include<bits/stdc++.h>
using namespace std;
namespace IO
{
  	template <typename T>
	void read(T & tmp){ tmp=0;char ch=getchar();bool f=0;while(!isdigit(ch)) f=ch=='-',ch=getchar();while(isdigit(ch)) tmp=(tmp<<3)+(tmp<<1)+ch-'0',ch=getchar();if(f) tmp=-tmp;}
	template <typename T, typename... Args>
	void read(T &tmp, Args &...tmps){ read(tmp);read(tmps...); }
	template <typename T>
	void _write(const T &tmp){if(tmp==0) return;_write(tmp/10);putchar(tmp%10+'0');}
	template <typename T>
	void write(const T & tmp){if(tmp==0){putchar('0');return ;}if(tmp<0)putchar('-');_write((tmp<0?-tmp:tmp));}
}  
namespace sp_FileHead
{
	template <typename T> T gcd(T tmp1,T tmp2){return !tmp2 ? tmp1 : gcd(tmp2,tmp1/tmp2);}
   	template<typename T> T lcm(T tmp1,T tmp2){return tmp1*tmp2/gcd(tmp1,tmp2);}
	template <typename T> T _max(T tmp1,T tmp2){return tmp1>tmp2 ? tmp1 : tmp2;};
	template <typename T> T _min(T tmp1,T tmp2){return tmp1<tmp2 ? tmp1 : tmp2;};
	template <typename T> T _abs(T tmp){return tmp<0 ? -tmp : tmp;}
	void _file(){freopen("source.in","r",stdin);freopen("source.out","w",stdout);}
	#define psb push_back
	#define psf push_front
	#define ppb pop_back
	#define ppf pop_front
	#define pii pair<int,int>
	#define piii tuple<int,int,int>
	#define ll long long
	#define ull unsigned long long
	#define LL __int128
	#define IT iterator
	#define fi first
	#define se second
	#define th third 
	#define For(X,XX,XXX) for(register int X=XX;X<=XXX;++X)
	#define Fol(X,XX,XXX) for(register int X=XX;X>=XXX;--X)
	#define Gor(X,XX,XXX) for(register int X=head[XX];X;X=XXX[X].nex)
	#define _setup(XXX,XXXXX) memset(XXX,XXXXX,sizeof(XXX));
	#define Umap unordered_map
	#define Uset unordered_set
	#define Mset multiset
	#define Gc getchar
	#define Pc putchar
	#define sq(XXX) (XXX*XXX)
	#define PQ priority_queue
};
using namespace IO;
using namespace sp_FileHead;
/*--end of File Head--*/
const int N=2e5+5;
int n,m,a[N],b[N],alloc,root[N],tot;
struct point{
	int l,r,cnt,lc,rc;
}tree[N<<5];
void build(int &p,int l,int r)
{
	p=++tot;
	tree[p].l=l;tree[p].r=r;
	tree[p].cnt=0;
	if(l==r) return ;
	int mid=(l+r)>>1;
	build(tree[p].lc,l,mid);
	build(tree[p].rc,mid+1,r);
}
void modify(int &p,int q,int loc)
{
	p=++tot;
	tree[p]=tree[q];
	tree[p].cnt++;
	if(tree[p].l==tree[p].r) return ;
	int mid=(tree[p].l+tree[p].r)>>1;
	if(loc<=mid) modify(tree[p].lc,tree[q].lc,loc);
	else modify(tree[p].rc,tree[q].rc,loc);
}
int kth(int x,int y,int k)
{
	int s=tree[tree[y].lc].cnt-tree[tree[x].lc].cnt;
	if(tree[x].l==tree[x].r) return tree[x].l;
	int mid=(tree[x].l+tree[x].r)>>1;
	if(s>=k) return kth(tree[x].lc,tree[y].lc,k);
	else return kth(tree[x].rc,tree[y].rc,k-s);
}
int main()
{
  //_file();
  read(n,m);
  For(i,1,n)
  {
     read(a[i]);
     b[i]=a[i];
  }
  sort(b+1,b+1+n);
  alloc=unique(b+1,b+1+n)-b-1;
  build(root[0],1,alloc);
  For(i,1,n)
  {
     int loc=lower_bound(b+1,b+1+alloc,a[i])-b;
	 modify(root[i],root[i-1],loc);	
  }   
  int l,r,k;
  while(m--)
  {
  	 read(l,r,k);
  	 write(b[kth(root[l-1],root[r],k)]);
  	 Pc('\n');
  }
  return 0;
}
```