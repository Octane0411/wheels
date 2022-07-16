package gout

import (
	"fmt"
	"log"
	"runtime"
	"strings"
)

func Recovery() HandlerFunc {
	return func(c *Context) {
		defer func() {
			if err := recover(); err != nil {
				message := fmt.Sprintf("%s", err)
				log.Printf("%s\n\n", trace(message))
				c.Fail(500, "Internal Server Error")
			}
		}()
		c.Next()
	}
}

// 打印堆栈信息
func trace(message string) string {
	var pcs [32]uintptr
	// 这里按顺序是 runtime.Callers
	// trace
	// recovery
	// panic
	// panic
	// 代码中panic的那一行
	// 所以skip设置为3和5都是合理的
	n := runtime.Callers(5, pcs[:]) // 跳过开始的3个caller

	var str strings.Builder
	str.WriteString(message + "\nTraceback:")
	for _, pc := range pcs[:n] {
		fn := runtime.FuncForPC(pc)
		file, line := fn.FileLine(pc)
		str.WriteString(fmt.Sprintf("\n\t%s:%d", file, line))
	}
	return str.String()
}
