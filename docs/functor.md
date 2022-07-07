# 仿函数
## Part1: 仿函数是什么？

~~众所周知~~，STL里有一个玩意儿叫 ```greater``` 。

他最大的用处在 ```sort``` 里，比如说
```cpp
sort(vec.begin(),vec.end(),greater<int>());
```
那么问题来了：那个```()```是什么？我们自定义cmp函数时不都是用
```cpp
sort(vec.begin(),vec.end(),cmp);
```
的吗？

---

有人说，```()```表示这是一个函数。恭喜，答对了一半，这是**仿**函数。

但是请注意，说仿函数接近函数是七窍通了六窍。仿函数，其实是**类**，不是**函数**！

那么既然是类，那么```()```的作用就说得通了：这是类的初始化，初始化完就和```cmp```等价。

在正常的地方，调用仿函数的格式为```func(/*类初始化*/)(参数)```，例如```greater<int>()(1,2)```
## Part2: 怎么写仿函数？
可一个类，怎么能当函数耍呢？

~~众所周知~~，c++里有伟大的**重载运算符**。

回忆一下调用函数的过程：

```cpp
函数名(参数1,参数二,...);
```

其中最核心的就是一个```()```。

俗话说，万物可重载。既然要用```()```，那就把它重载了！

还记得重载运算符的格式吗？

```cpp
<返回类型> operator<运算符> (<类型> a, <类型> b)
{
	//do something
	return something;
}
```
那么，我们也照样来一遍:把运算符换成```()```，把类型换成想要的：
```cpp
type operator() (type a, type b, type c)
{
	//do something...
    return something;
}
```

没错，这样就能当函数耍了！

举个栗子：
```cpp
#include<bits/stdc++.h>
using namespace std;
class square//计算某数的平方
{
public:
    int operator() (int x)//重载运算符
    {
        return x*x;
    }
};

int main(){
    int x;
    cin>>x;
    cout<<square()/*初始化*/(x)/*调用函数*/;
    return 0;
}
```
##### 输入：
3
##### 输出：
9

## Part3: 仿函数有什么用？

STL里面有一个东西叫做```count_if```。
我们用正常的方式自定义函数来统计一串数中大于5的数的个数:
```cpp
bool check(int x)
{
	return x>5;
}    
```
然后只要```count_if(vec.begin(), vec.end(), check)```就行了。

但是如果要统计大于n的数怎么办？如果check函数用两个参数STL是不接受的。

于是我们就想到了仿函数。
```cpp
class check
{
public:
    int x;
    check(int _x)
    {
        x=_x;
    }
    bool operator() (int _toCheck)
    {
        return _toCheck>x;
    }
};
```
之后在主函数里```count_if(vec.begin(), vec.end(), check(n))```就搞定。

另外，STL中自定义函数指针是不能用模版函数的，所以需要模版函数时用仿函数就很好。

例如：

```cpp
#include<bits/stdc++.h>
#define ll long long 
using namespace std;
template<typename tp> class mygreater
{
public:
    bool operator() (tp & a, tp & b);
};
template<typename tp> 
bool mygreater<tp>::operator() (tp & a, tp & b)
{
    return a>b;
}
int a[10000],n;
int main(){
    cin>>n;
    for(int i=1; i<=n; i++) scanf("%d",&a[i]);
    sort(a+1,a+1+n,mygreater<int>());
    for(int i=1; i<=n; i++) cout<<a[i]<<' ';
    return 0;
}
```

## Part4: 实际应用
[学生去重](https://www.luogu.com.cn/problem/U181522)
我们可以使用仿函数来作为比较函数。
```cpp
struct stu//学生
{
    string name;
    int a,b,c,d;
}student[100001];

class my_less
{
public:
    bool operator() (const stu & a, const stu & b)
    {
        return a.name<b.name;//字典序
    }
};
template<int x> class my_equal
{
public:
    bool operator() (const stu & a, const stu & b)
    {
        return a.name==b.name && abs(a.a+a.b+a.c+a.d-b.a-b.b-b.c-b.d)<=x;//名字相同且分数差小于要求
    }
};
```
主函数部分：
```cpp
	stable_sort(student,student+n,my_less());//排序
    int idx=unique(student,student+n,my_equal<3>())-student;//去重
    for(int i=0; i<idx; i++)
    {
        cout<<student[i].name<<' '<<student[i].a<<' '<<student[i].b<<' '<<student[i].c<<' '<<student[i].d<<endl;
    }
```

## Part5: 配接
话说lls整天没事干，于是把统计学生的题目改了一下：统计分数之和大于等于m的学生数量，怎么办？

我们当然可以像统计大于n的数的个数一样，写成```check(m)```的形式，但如果我们不想这么干呢？

第一件想到的事情就是用仿函数```greater<stu>```

但是```count_if```只接受带一个参数的函数，怎么办？
那就把第二个参数绑定成一个特定的值呗：
```cpp
//学生结构体定义略
bool operator> (stu a, stu b)
{
    return a.a+a.b+a.c+a.d>b.a+b.b+b.c+b.d;
}
int main(){
    cin>>n>>m;
    stu cmp=(stu){"nil",m,0,0,0};//总分刚好为m的学生
    for(int i=0; i<n; i++) 
    {
        string x;
        int a,b,c,d;
        cin>>x>>a>>b>>c>>d;
        student[i]=(stu){x,a,b,c,d};
    }
    cout<<count_if(student,student+n,bind2nd(greater<stu>(),cmp));//每次调用相当于greater<stu>()(_数组中的值_,cmp)
    return 0;
}
```

类似的函数有四个：(仿函数名```op```，固定值```value```，数组中的值```x```）

```bind1st(op(),value```: 相当于调用```op()(value,x)```

```bind2nd(op(),value```: 相当于调用```op()(x,value)```

```not1(op())```: 相当于调用```!op()(x)```

```not2(op())```: 相当于调用```!op()(x_1, x_2)```

栗子：
```cpp
#include<bits/stdc++.h>
#define ll long long 
using namespace std;
int n,m;
struct stu
{
    string name;
    int a,b,c,d;
}student[100001];

bool operator> (stu a, stu b)
{
    return a.a+a.b+a.c+a.d>b.a+b.b+b.c+b.d;
}

int main(){
    cin>>n;
    stu cmp=(stu){"nil",m,0,0,0};
    for(int i=0; i<n; i++) 
    {
        string x;
        int a,b,c,d;
        cin>>x>>a>>b>>c>>d;
        student[i]=(stu){x,a,b,c,d};
    }
    sort(student,student+n,not2(greater<stu>()));//按非升序排列（也就是greater<stu>取反）
    for(int i=0; i<n; i++)
    {
        cout<<student[i].name<<' '<<student[i].a<<' '<<student[i].b<<' '<<student[i].c<<' '<<student[i].d<<endl;
    }
    return 0;
}
```
## Part6: 参考文献
[CSDN](https://blog.csdn.net/coolwriter/article/details/81533226)
