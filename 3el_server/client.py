import grpc
import three_el_pb2_grpc
import three_el_pb2
channel = grpc.insecure_channel('localhost:50051')
stub = three_el_pb2_grpc.RatingProviderStub(channel)
result = stub.GetProductClass(three_el_pb2.ProductName(name="Soap for Goodness Sakes"))
print(result)