# 图论：从橙色到黑色
## 1.存图
### 1.1 邻接矩阵
记 f[i][j] 为 i 到 j 的有向边的边权（无向边建两次）。

时间：O(n^2)  空间： O(n^2)

优点：

- 容易理解
- 简单明了

缺点：

- 炸时间，炸空间
- 无法处理重边

### 1.2 邻接表（ low版 ）

既然无法处理重边，那么我们就给数组**改进一下**！

记 $f[i][k]$ 为 $i$ 出发的第 $k$ 条有向边的边权（无向边建两次），$num[i]$ 表示从 $i$ 出发的有向边的数量。

时间：$O(m)$  空间： $O(n^2)$

优点：
- 可以处理重边

缺点：

- 炸空间

### 1.3 邻接表（ vector ）

可以发现，刚才的数组中有很多空间是浪费的，原因是我们不知道数组要开多大。

那么，我们就可以用 ```vector```——可变数组来节省空间。

```cpp
struct edge{
	int v,w;
};
vector<edge> g[MAXN];

void add(int u, int v, int w)
{
	g[u].push_back((edge){v,w});
}
```

$g[u][i]$ 表示从 $u$ 出发的第 $i$ 条边， $v$ 表示这条边的终点， $w$ 表示这条边的边权。

遍历时便可以直接```for(int i=0; i<g[u].size(); i++) {edge e=g[u][i]; /*do something*/}```。

优点：
- 可以处理重边
- 易于编写
- 遍历方便

缺点：

- 不开 O2 时常数太大

### 1.4 邻接表（链式前向星）

```cpp
struct edge{
	int u,v,w,nxt;
};
edge e[MAXE];
int cnt=0,head[MAXN];
void add(int u, int v, int w)
{
	e[++cnt]=(edge){u,v,w,head[u]};
    head[u]=cnt;
}
```
$head[u]$ 表示从 $u$ 出发的最后一条边， $u$ 表示这条边的起点， $v$ 表示这条边的终点， $w$ 表示这条边的边权， $nxt$ 表示这个点出发的下一条边。

遍历时便可以直接```for(int i=head[u]; i; i=e[i].next) {edge ed=e[i]; /*do something*/}```。

优点：
- 可以处理重边
- 手写常数小
- 遍历方便

缺点：

- 码量较大

## 2.__短路问题
### 2.0 写在前头
> 由于```Dijkstra```在比赛中实在太常用了，而且基本不会被卡，所以下面的代码都用这一种算法，并且用1.3的方式存图。

### 2.1 最短路

非常基础，所以不做过多说明。思想是贪心。

算法：Dijkstra

定义：
```cpp
struct point{
	int x;
	int step;
	bool operator< (const point & rhs) const
	{
		return rhs.step<step;
	}
};
priority_queue<point> pq;
int vis[50001];
int dis[50001];
```
核心代码：
```cpp
int dijkstra(int st, int ed)
{
	memset(dis,0x7f,sizeof(dis));
    memset(vis,0,sizeof(vis));
	pq.push((point){
		st,0
	});
	dis[st]=0;
	while(!pq.empty())
	{
		point u=pq.top();pq.pop();
		if(vis[u.x]) continue;
		vis[u.x]=1;
		for(int i=0; i<g[u.x].size(); i++)
		{
			int v=g[u.x][i].v;
			if(dis[v]>dis[u.x]+g[u.x][i].w)
			{
				dis[v]=dis[u.x]+g[u.x][i].w;
				pq.push((point){
					v,dis[v]
				});
                        
			}
		}
	}
	return dis[ed];
}
```
算法：BF

思想：对于每个点松弛一轮。复杂度O(nm)。

- 优化1:队列

  > 很明显有很多松弛没有必要，所以可以开个队列记录一下。

- 优化2:判重。
	
  > 很明显已经在队列里的点再进一次队列没有必要。

至此，我们已经完成了SPFA算法。
更多优化请见[fstqwq的回答](https://www.zhihu.com/question/292283275/answer/484871888)
### 2.2 次短路
在最短路的基础上，想到把 $dis$ 数组多开一维，用 $dis[i][1]$ 表示到 $i$ 这个点的最短路，用 $dis[i][2]$ 表示到 $i$ 这个点的次短路。

定义：
```cpp
struct point{
	int x;
	int step;
	bool operator< (const point & rhs) const
	{
		return rhs.step<step;
	}
};
priority_queue<point> pq;
int vis[50001];
int dis[50001][3];
```
代码：
```cpp
int dijkstra_2th(int st, int ed)
{
	pq.push((point){
		st,0
	});
	dis[st][1]=0;
	while(!pq.empty())
	{
		point u=pq.top();pq.pop();
		
		vis[u.x]=1;
		for(int i=0; i<g[u.x].size(); i++)
		{
			int v=g[u.x][i].v;
            bool flg=0;
			if(u.step+g[u.x][i].w<dis[v][1])
			{
				dis[v][2]=dis[v][1];
				dis[v][1]=u.step+g[u.x][i].w;
				flg=1;
			}
			if(u.step+g[u.x][i].w>dis[v][1] && u.step+g[u.x][i].w<dis[v][2])
			{
				dis[v][2]=u.step+g[u.x][i].w;
				flg=1;
			}
			if(dis[u.x][2]+g[u.x][i].w<dis[v][2])
			{
				dis[v][2]=dis[u.x][2]+g[u.x][i].w;
				flg=1;
			}
			if(flg)
			{
				pq.push((point){v,dis[v][1]});
			}
		}
	}
	return dis[ed][2];
}
```

### 2.3 k短路
这里只讨论k很小的情况。

很显然，将 $dis$ 数组多开一维，用 $dis[i][j]$ 表示到 $i$ 这个点的第 $j$ 短路。

每次松弛操作就是对 $dis$ 数组进行插入排序。

代码略。

### 2.4 指定边的最短路

很显然，设整张图起点为 $s$ ，终点为 $t$ ，指定边起点为 $u$ ，终点为 $v$ ，边权为 $w$ ，最后要求的答案就是```dijkstra(s,u)+w+dijkstra(v,t)```。

代码略。

## 3.环

### 3.1 全图最小环

算法：```Floyd```

时间复杂度：$O(n^3)$

具体实现：
```cpp
for(int k=1; k<=n; k++)
{
	for(int i=1; i<k; i++)
		for(int j=i+1; j<k; j++)
			ans=min(ans,dp[i][j]+g[i][k]+g[k][j]);
	for(int i=1; i<=n; i++)
		for(int j=1; j<=n; j++)
			dp[i][j]=min(dp[i][j],dp[i][k]+dp[k][j]),dp[j][i]=dp[i][j];
}
```
## 4.连通分量
### 4.1 强连通分量
#### 4.1.0 定义
强连通分量(**SCC**)：有向图中任意节点互相可达的子图。
（补充）弱连通分量(**WCC**)：将这张有向图看作无向图后任意节点互相可达的子图。
#### 4.1.1 Kosaraju 算法
~~时间复杂度：可以用「可怕」来形容。~~
##### 4.1.1.1 过程
1. 对原图 DFS ,记录其后序遍历结果并将其入栈。
2. 选择栈顶的顶点出栈，若还没被搜过，对反图 DFS。
3. 假如还有顶点未被搜过，重复上一步。

##### 4.1.1.2 证明

原图的强连通分量与反图相同。
若原图中节点 U,V 互不可达，则反图中同样互不可达。

##### 4.1.1.3 代码
```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=1e5+5,M=1e5+5;
struct edge{
    int to,nex;
}e[2][M];
bool used[N];//第一次深搜搜过
int SCC[N];//在哪个连通分量里 
int head[2][N],tot[2],n,m,st[N],top=0,ans;
void addEdge(int edt,int u,int v)
{
    e[edt][++tot[edt]]=(edge){v,head[edt][u]};
    head[edt][u]=tot[edt];
}
void dfs(int u)//深搜  
{
    for(int i=head[0][u];i;i=e[0][i].nex)
    {
        int v=e[0][i].to;
        if(!used[v])
        {
            used[v]=1;
            dfs(v);
        }
    }
    st[++top]=u;
}
void find(int u,int fa)//找SCC 
{
    for(int i=head[1][u];i;i=e[1][i].nex)
    {
        int v=e[1][i].to;
        if(!SCC[v])
        {
            SCC[v]=fa;
            find(v,fa);
        }
    }
}
int main()
{
    int u,v;
    cin>>n>>m;
    while(m--)
    {
        scanf("%d%d",&u,&v);
        addEdge(0,u,v);
        addEdge(1,v,u);
    }
    for(int i=1;i<=n;i++)
    {
        printf("%d : ",i);
        for(int j=head[0][i];j;j=e[0][j].nex)
        {
            printf("%d ",e[0][j].to);   
        }
        puts("");
    }
    for(int i=1;i<=n;i++)
    {
        if(!used[i])
        {
            used[i]=1;
            dfs(i);
        }
    }
    while(top)
    {
        int u=st[top--];
        if(!SCC[u])
        {
            SCC[u]=++ans;
            find(u,ans);
        }
    }
    for(int i=1;i<=ans;i++)
    {
        for(int j=1;j<=n;j++)
        {
            if(SCC[j]==i)
            {
                printf("%d ",j);
            }
        }
        puts("");
    }
    return 0;
}
```

#### 4.1.2 Tarjan 算法

时间复杂度：O(n)

代码：

```cpp
void tarjan(int x)
{
	dfn[x]=low[x]=++timer;
	inst[x]=1;
	st[++top]=x;
	for(int i=head[x]; i; i=e[i].nxt)
	{
		int v=e[i].v;
		if(!dfn[v]){
			tarjan(v);
			low[x]=min(low[x],low[v]);
		}
		else if(inst[v])
		{
			low[x]=min(low[x],dfn[v]);
		}
	}
	if(low[x]==dfn[x])
	{
		int k;
		++tot;
		do
		{
			k=st[top];
			belong[st[top]]=tot;
			top--;
			inst[k]=0;
		}while(k!=x);
	}
}
	
```

### 4.2 割点

同样使用```tarjan```。

```cpp
void tarjan(int u, int fa)
{
	dfn[u]=low[u]=++cnt;
	int child=0;
	for(int i=head[u];i;i=e[i].nxt)
	{
		int v=e[i].v;
		if(!dfn[v])
		{
			tarjan(v,u);
			low[u]=min(low[u],low[v]);
			if(low[v]>=dfn[u] && u!=fa)
				cut[u]=1;
			else if(u==fa)
				child++;
		}
		low[u]=min(low[u],dfn[v]);
	}
	if(u==fa && child>=2) cut[u]=1;
}
```




