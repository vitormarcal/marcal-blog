---
title: Como mockar requisições do retrofit
description: Uma simples maneira de mockar requisições ultilizando Retrofit, OkHttp e continuar com seus testes unitários.
author: Vítor Marçal
created_at: 2019-08-27
is_post: true
tags:
  - tecnologia
  - programacao
  - portugues
related:
  - "[[tags/programacao]]"
  - "[[tags/portugues]]"
image: img/kawarimi_no_jutsu.png
language: pt
---
![Como mockar requisições do retrofit](img/kawarimi_no_jutsu.png)

__Kawarimi no Jutsu__ - Técnica de substituição / Photo by Naruto

Retrofit é uma biblioteca incrivelmente poderosa que simplifica significativamente a integração com serviços web. Ao me deparar com ela pela primeira vez, deparei-me com um desafio: como prosseguir com meus testes unitários simulando as respostas do Retrofit? É isso que exploraremos neste artigo.

Em termos simples, um mock é nada mais do que um objeto falso que imita o comportamento de outro objeto. Suponha que você tenha uma chamada de API ao usar `apiService.getProduct(id)`. Você pode criar um objeto que simula essa chamada à API de produtos, retornando, por exemplo, um produto estático. Para todos os efeitos, o objeto que faz a chamada `apiService.getProduct` não tem conhecimento de que está interagindo com um objeto falso, "mockado". É semelhante à técnica de substituição em Naruto: o atacante acredita que está atingindo o ninja, mas, na verdade, está atacando outro objeto, como um pedaço de madeira.

A diferença crucial no contexto de mocks em programação é que o "atacante" (ou seja, o objeto cliente) nunca percebe que o ninja-alvo foi substituído pelo pedaço de madeira (o mock). Ficou claro?

![](https://www.marcal.dev/content/images/2023/12/Kawarimi_no_Jutsu.webp)

__O__ atacante acha estar atingindo o adversário mas na verdade está atacando outro objeto qualquer / Photo by Naruto

Em resumo, ao utilizar mocks, você está efetivamente substituindo o comportamento real da chamada à API por um comportamento simulado durante os testes, proporcionando um ambiente controlado para avaliar o funcionamento do restante do código. Essa prática é fundamental para garantir a qualidade e a confiabilidade de seu código, especialmente quando lidamos com integrações externas.

Imagine que em sua aplicação existe uma integração a uma Api chamada StoreApi. Nessa hipotética API, você consegue listar produtos e acessar seus detalhes. Por exemplo, ao consultar a uri `products/`, é retornado uma lista de produtos; ao fazer uma requisição a `products/{id}` o retorno é o detalhe de determinado produto. Prosseguindo, em nossa aplicação, temos uma funcionalidade que em determinado ponto busca um produto na API passando o `id` do recurso, para logo após imprimir suas informações. Para nosso exemplo, não importa o que método `print` faz:

```java
// package, imports omitidos
class ProductService {
    private final StoreApi storeApi;
    private static final Logger log =
    Logger.getLogger(ProductService.class.getName());

    ProductService(StoreApi storeApi) {
        this.storeApi = storeApi;
    }

    void printProductOfId(Long id) {
        Optional<Product> optionalProduct = findInStoreApi(id);
        if (optionalProduct.isPresent()) {
            print(optionalProduct.get());
        } else {
            throw new RuntimeException("Product not found");
        }
    }

    Optional<Product> findInStoreApi(Long id) {
        final Response<Product> response;
        try {
            response = this.storeApi.getDetail(id).execute();
            if (response.isSuccessful()) {
                return Optional.ofNullable(response.body());
            } else {
                log.log(
                  Level.WARNING,
                  "The response body is empty with id " + id
                );
                return Optional.empty();
            }
        } catch (IOException e) {
            log.log(Level.WARNING, "Error with id " + id, e);
            return Optional.empty();
        }

    }

    private void print(Product product) {
        System.out.println(product);
    }
}


```


`class ProductService`

Você deseja criar um teste unitário para o método `printProductOfId`, mas por algum motivo você não pode fazer uma chamada real a StoreApi e talvez você nem queira realmente disparar uma requisição verdadeira: vamos supor que cada requisição gere um custo para você! Podemos continuar nossos testes simplesmente mockando a `StoreApi` com um `interceptor`:

```java
// package, imports da classe omitidos
class RestClientMock {
    private static StoreApi storeApi;

    static StoreApi getClient() {
        if (storeApi == null) {
            final OkHttpClient client = new OkHttpClient.Builder()
                    .addInterceptor(new FakeInterceptor())
                    .build();

            final Retrofit retrofit = new Retrofit.Builder()
                    .addConverterFactory(
                      GsonConverterFactory.create()
                    )
                    .baseUrl("https://wwww.storemock-api.com.br")
                    .client(client)
                    .build();

            storeApi = retrofit.create(StoreApi.class);
        }
        return storeApi;
    }
}

```


`class RestClientMock`

Perceba que adicionamos um novo `interceptor` chamado `FakeInterceptor`. Ele intercepta a requisição e devolve uma resposta mockada, assim como o nome da classe diz:

```java
// package, imports omitidos
public class FakeInterceptor implements Interceptor {
    private static final String productDetail = 
    "{\"id\":1,\"name\":\"Book\"}";


    @Override
    public Response intercept(Chain chain) {
        Response response;
        String responseString = "{}";
        final List<String> paths = chain.request()
                                    .url()
                                    .pathSegments();

        Response.Builder builder = new Response.Builder();
        builder.code(404);
        if (paths != null && !paths.isEmpty()) {
            String lastPath = paths.get(paths.size() - 1);
            if (lastPath.equals("1")) {
                builder.code(200);
                responseString = productDetail;
            }
        }

        response = builder
                .message(responseString)
                .request(chain.request())
                .protocol(Protocol.HTTP_1_0)
          .body(ResponseBody.create(
                  MediaType.parse("application/json"),
                  responseString.getBytes()
                  ))
          .addHeader("content-type", "application/json")
          .build();

        return response;
    }
}

```


`class FakeInterceptor`

Agora só precisamos utilizar o cliente mockado em nossos testes unitários:

```java
// package, imports omitidos
public class ProductServiceTest {
    private static final StoreApi storeApi = RestClientMock.getClient();

    @Test
    public void printProductOfId() {
        ProductService productService = new ProductService(storeApi);
        productService.printProductOfId(1L);
        // some test to validate the print
    }

    @Test(expected = RuntimeException.class)
    public void giveProductNotFound_ThenThrowRuntimeException() {
        ProductService productService = new ProductService(storeApi);
        productService.printProductOfId(2L);
    }

    @Test
    public void productIsPresent() {
        ProductService productService = new ProductService(storeApi);
        Optional<Product> optionalProduct = productService.findInStoreApi(1L);
        assertTrue(optionalProduct.isPresent());
    }

    @Test
    public void productIsNotPresent() {
        ProductService productService = new ProductService(storeApi);
        Optional<Product> optionalProduct = productService.findInStoreApi(2L);
        assertFalse(optionalProduct.isPresent());
    }
}

```


`class ProductServiceTest`

A implementação completa deste exemplo pode ser [encontrada neste repositório do GitHub](https://github.com/vitormarcal/retrofit-unit-test-tutorial).