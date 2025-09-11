

class Queue {
    constructor() {
        this.items = []
    }
    // 入队 被发现队
    enqueue(data) {
        this.items.push(data)
    }
    // 出队 先入先出
    dequeue() {
        return this.items.shift();
    }
    size() {
        return this.items.length
    }
}

class Graphs {
    constructor() {
        // 存储所有顶点
        this.vertices = []
        // 存储每个顶点对应的相邻顶点（边）
        this.edges = []
    }
    // 添加节点
    addVertex(...rest) {
        rest.forEach(v => {
            // 数据includes判断是否含有某值
            if (this.vertices.includes(v)) return;
            // 添加节点
            this.vertices.push(v)
            // 添加节点相连数组
            this.edges[v] = []
        })
    }
    // 添加边
    addEdge(v1, v2) {
        //添加节点 
        this.addVertex(v1, v2);
        // 数组里天机边
        if (this.edges[v1].includes(v2)) return;
        this.edges[v1].push(v2)
        this.edges[v2].push(v1)

    }
    // 广度优先
    BFS(v) {
        let vertices = this.vertices,
            edges = this.edges,
            color = {},
            queue = new Queue(),
            info = {};

        // 对每个节点添加 状态标志
        this.vertices.forEach(v => {
            color[v] = '无状态';
        })

        // 从入口节点v入队开始探索
        queue.enqueue(v);
        color[v] = '被发现';
        info[v] = { distance: 0, path: v };

        // 发现于探索
        while (queue.size()) {
            let u = queue.dequeue();//出队
            edges[u].forEach(v => {//遍历A对应的直连边数组
                if (color[v] !== '无状态') return;
                color[v] = '被发现';
                queue.enqueue(v);//无状态的入队
                info[v] = {
                    distance: info[u].distance + 1,
                    path: info[u].path + '->' + v
                }

            });
            color[u] = "被探索";
        }
        //返回路径信息
        return info
    }
}

export default Graphs
