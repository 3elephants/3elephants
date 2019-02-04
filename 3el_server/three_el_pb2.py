# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: three_el.proto

import sys
_b=sys.version_info[0]<3 and (lambda x:x) or (lambda x:x.encode('latin1'))
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor.FileDescriptor(
  name='three_el.proto',
  package='',
  syntax='proto3',
  serialized_options=None,
  serialized_pb=_b('\n\x0ethree_el.proto\"\x1b\n\x0bProductName\x12\x0c\n\x04name\x18\x01 \x01(\t\"i\n\x0e\x43lassification\x12-\n\nclass_type\x18\x01 \x01(\x0e\x32\x19.Classification.ClassType\"(\n\tClassType\x12\x08\n\x04GOOD\x10\x00\x12\x07\n\x03\x42\x41\x44\x10\x01\x12\x08\n\x04NONE\x10\x02\x32\x44\n\x0eRatingProvider\x12\x32\n\x0fGetProductClass\x12\x0c.ProductName\x1a\x0f.Classification\"\x00\x62\x06proto3')
)



_CLASSIFICATION_CLASSTYPE = _descriptor.EnumDescriptor(
  name='ClassType',
  full_name='Classification.ClassType',
  filename=None,
  file=DESCRIPTOR,
  values=[
    _descriptor.EnumValueDescriptor(
      name='GOOD', index=0, number=0,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='BAD', index=1, number=1,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='NONE', index=2, number=2,
      serialized_options=None,
      type=None),
  ],
  containing_type=None,
  serialized_options=None,
  serialized_start=112,
  serialized_end=152,
)
_sym_db.RegisterEnumDescriptor(_CLASSIFICATION_CLASSTYPE)


_PRODUCTNAME = _descriptor.Descriptor(
  name='ProductName',
  full_name='ProductName',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='name', full_name='ProductName.name', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=18,
  serialized_end=45,
)


_CLASSIFICATION = _descriptor.Descriptor(
  name='Classification',
  full_name='Classification',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='class_type', full_name='Classification.class_type', index=0,
      number=1, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
    _CLASSIFICATION_CLASSTYPE,
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=47,
  serialized_end=152,
)

_CLASSIFICATION.fields_by_name['class_type'].enum_type = _CLASSIFICATION_CLASSTYPE
_CLASSIFICATION_CLASSTYPE.containing_type = _CLASSIFICATION
DESCRIPTOR.message_types_by_name['ProductName'] = _PRODUCTNAME
DESCRIPTOR.message_types_by_name['Classification'] = _CLASSIFICATION
_sym_db.RegisterFileDescriptor(DESCRIPTOR)

ProductName = _reflection.GeneratedProtocolMessageType('ProductName', (_message.Message,), dict(
  DESCRIPTOR = _PRODUCTNAME,
  __module__ = 'three_el_pb2'
  # @@protoc_insertion_point(class_scope:ProductName)
  ))
_sym_db.RegisterMessage(ProductName)

Classification = _reflection.GeneratedProtocolMessageType('Classification', (_message.Message,), dict(
  DESCRIPTOR = _CLASSIFICATION,
  __module__ = 'three_el_pb2'
  # @@protoc_insertion_point(class_scope:Classification)
  ))
_sym_db.RegisterMessage(Classification)



_RATINGPROVIDER = _descriptor.ServiceDescriptor(
  name='RatingProvider',
  full_name='RatingProvider',
  file=DESCRIPTOR,
  index=0,
  serialized_options=None,
  serialized_start=154,
  serialized_end=222,
  methods=[
  _descriptor.MethodDescriptor(
    name='GetProductClass',
    full_name='RatingProvider.GetProductClass',
    index=0,
    containing_service=None,
    input_type=_PRODUCTNAME,
    output_type=_CLASSIFICATION,
    serialized_options=None,
  ),
])
_sym_db.RegisterServiceDescriptor(_RATINGPROVIDER)

DESCRIPTOR.services_by_name['RatingProvider'] = _RATINGPROVIDER

# @@protoc_insertion_point(module_scope)